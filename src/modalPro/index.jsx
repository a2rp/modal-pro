import React, { useMemo, useRef, useState } from "react";
import { Styled } from "./Styled.js";
import "./styles.css";
import Modal from "./Modal.jsx";
import Drawer from "./Drawer.jsx";
import useLocalStorage from "./useLocalStorage.js";
import { toast } from "react-toastify";

import { ConfirmProvider, useConfirm } from "./useConfirm.jsx";

function ModalProInner() {
    const [modalOpen, setModalOpen] = useState(false);
    const [drawerOpen, setDrawerOpen] = useState(false);

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");

    const normalizeEmail = (s) => s.trim().toLowerCase();

    const [entries, setEntries, clearEntries] = useLocalStorage("modalpro:profiles", []);

    const openerRef = useRef(null);

    const confirm = useConfirm();

    const handleSave = () => {
        const n = name.trim();
        const e = email.trim();

        if (!n || !e) {
            toast.info("Please enter both name and email.");
            return;
        }

        if (entries.some((x) => normalizeEmail(x.email) === normalizeEmail(e))) {
            toast.error("This email already exists.");
            return;
        }

        const item = {
            id: (self.crypto?.randomUUID && crypto.randomUUID()) || Math.random().toString(36).slice(2),
            name: n,
            email: e,
            ts: Date.now(),
        };

        setEntries((prev) => [item, ...prev]);
        setModalOpen(false);
        setName("");
        setEmail("");
        toast.success("Profile saved");
    };

    const removeEntry = (id) => setEntries((prev) => prev.filter((x) => x.id !== id));

    const fmt = (ts) => {
        const d = new Date(ts);
        const parts = new Intl.DateTimeFormat("en-US", {
            timeZone: "Asia/Kolkata",
            month: "short",
            day: "numeric",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: false,
        }).formatToParts(d);

        const get = (t) => parts.find((p) => p.type === t)?.value || "";
        const day = get("day").padStart(2, "0");
        const month = get("month");
        const year = get("year");
        const hh = get("hour");
        const mm = get("minute");
        const ss = get("second");

        return `${month} ${day}, ${year} ${hh}:${mm}:${ss}`;
    };

    const stats = useMemo(() => ({
        total: entries.length,
        latestAt: entries[0]?.ts ? fmt(entries[0].ts) : null,
    }), [entries]);

    const onDelete = async (id, profileName) => {
        const ok = await confirm({
            title: "Delete profile?",
            body: <>Delete <strong>{profileName}</strong>? This cannot be undone.</>,
            confirmText: "Delete",
            cancelText: "Cancel",
            tone: "danger",
        });
        if (ok) {
            removeEntry(id);
            toast.info("Profile deleted");
        }
    };

    const onClearAll = async () => {
        if (entries.length === 0) return;
        const ok = await confirm({
            title: "Clear all profiles?",
            body: <>This will remove <strong>{entries.length}</strong> profiles permanently.</>,
            confirmText: "Clear all",
            cancelText: "Cancel",
            tone: "danger",
        });
        if (ok) {
            clearEntries();
            toast.warning("Cleared all profiles");
        }
    };

    return (
        <>
            <Styled.Shell>
                <div style={{ width: "min(960px, 96vw)", display: "grid", gap: 16 }}>
                    <Styled.Panel>
                        <Styled.Title>Modal/Drawer Pro</Styled.Title>
                        <Styled.Sub>
                            ESC/backdrop close, nested z-index, scroll lock, and localStorage persistence.
                        </Styled.Sub>

                        <Styled.Row>
                            <button onClick={() => { setModalOpen(true); }} ref={openerRef}>
                                Open Modal
                            </button>
                            <button onClick={() => setDrawerOpen(true)}>
                                Open Drawer
                            </button>
                        </Styled.Row>

                        <Modal
                            open={modalOpen}
                            onClose={() => { setModalOpen(false); }}
                            title="Profile Settings"
                            initialFocus={openerRef}
                        >
                            <div style={{ marginTop: 8, display: "grid", gap: 8 }}>
                                <label>
                                    <span style={{ display: "block", marginBottom: 4 }}>Display name</span>
                                    <input
                                        type="text"
                                        placeholder="Ashish Ranjan"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        style={{
                                            width: "100%",
                                            background: "rgba(255,255,255,0.04)",
                                            color: "#fff",
                                            border: "1px solid var(--border)",
                                            borderRadius: 10,
                                            padding: "10px 12px",
                                            outline: "none",
                                        }}
                                    />
                                </label>

                                <label>
                                    <span style={{ display: "block", marginBottom: 4 }}>Email</span>
                                    <input
                                        type="email"
                                        placeholder="ashish@email.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        style={{
                                            width: "100%",
                                            background: "rgba(255,255,255,0.04)",
                                            color: "#fff",
                                            border: "1px solid var(--border)",
                                            borderRadius: 10,
                                            padding: "10px 12px",
                                            outline: "none",
                                        }}
                                    />
                                </label>

                                <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
                                    <button onClick={() => { setModalOpen(false); }}>Cancel</button>
                                    <button onClick={handleSave}>Save</button>
                                </div>
                            </div>
                        </Modal>

                        <Drawer
                            open={drawerOpen}
                            onClose={() => setDrawerOpen(false)}
                            side="right"
                            title="Notifications"
                        >
                            <p className="badge">Drawer is open. Try pressing ESC or clicking outside.</p>
                            <div style={{ display: "flex", gap: 8 }}>
                                <button onClick={() => setModalOpen(true)}>Open Modal on top</button>
                                <button onClick={() => setDrawerOpen(false)}>Close Drawer</button>
                            </div>
                        </Drawer>
                    </Styled.Panel>

                    <Styled.Panel>
                        <Styled.Title>Saved Profiles (localStorage)</Styled.Title>
                        <Styled.Sub>
                            <div>
                                Total: <strong>{stats.total}</strong>
                                {stats.latestAt ? <> &nbsp;•&nbsp; Latest at: <span className="badge">{stats.latestAt}</span></> : null}
                            </div>
                            <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
                                <button onClick={onClearAll}>Clear All</button>
                                <button
                                    onClick={() => {
                                        const blob = new Blob([JSON.stringify(entries, null, 2)], { type: "application/json" });
                                        const url = URL.createObjectURL(blob);
                                        const a = document.createElement("a");
                                        a.href = url; a.download = "profiles.json"; a.click();
                                        URL.revokeObjectURL(url);
                                    }}
                                >
                                    Export JSON
                                </button>
                            </div>
                        </Styled.Sub>

                        {entries.length === 0 ? (
                            <div className="badge">No saved profiles yet. Use the modal to add one.</div>
                        ) : (
                            <>
                                <table className="table" aria-label="Saved profiles">
                                    <thead>
                                        <tr>
                                            <th>Index</th>
                                            <th>Name</th>
                                            <th>Email</th>
                                            <th>Saved At</th>
                                            <th style={{ width: 140 }}>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {entries.map((e, index) => (
                                            <tr key={e.id}>
                                                <td>{e.index}.</td>
                                                <td>{e.name}</td>
                                                <td>{e.email}</td>
                                                <td>{fmt(e.ts)}</td>
                                                <td>
                                                    <div className="actions">
                                                        <button onClick={() => onDelete(e.id, e.name)}>Delete</button>
                                                        <button
                                                            onClick={() => {
                                                                navigator.clipboard?.writeText(JSON.stringify(e, null, 2));
                                                                toast.info("Copied JSON to clipboard");
                                                            }}
                                                        >
                                                            Copy JSON
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </>
                        )}
                    </Styled.Panel>
                </div>
            </Styled.Shell>
        </>
    );
}

export default function ModalProDemo() {
    return (
        <ConfirmProvider>
            <ModalProInner />
        </ConfirmProvider>
    );
}
