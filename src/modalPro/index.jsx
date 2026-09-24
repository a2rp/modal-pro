import React, { useMemo, useRef, useState } from "react";
import { Styled } from "./Styled.js";
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
    const [entries, setEntries, clearEntries] = useLocalStorage("modalpro:profiles", []);
    const openerRef = useRef(null);
    const confirm = useConfirm();

    const normalizeEmail = (value) => value.trim().toLowerCase();
    const fmt = (timestamp) => new Intl.DateTimeFormat("en-US", {
        timeZone: "Asia/Kolkata",
        month: "short",
        day: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
    }).format(new Date(timestamp));

    const stats = useMemo(() => ({
        total: entries.length,
        latestAt: entries[0]?.ts ? fmt(entries[0].ts) : null,
    }), [entries]);

    const handleSave = () => {
        const cleanName = name.trim();
        const cleanEmail = email.trim();
        if (!cleanName || !cleanEmail) {
            toast.info("Please enter both name and email.");
            return;
        }
        if (entries.some((entry) => normalizeEmail(entry.email) === normalizeEmail(cleanEmail))) {
            toast.error("This email already exists.");
            return;
        }
        const item = {
            id: globalThis.crypto?.randomUUID?.() || Math.random().toString(36).slice(2),
            name: cleanName,
            email: cleanEmail,
            ts: Date.now(),
        };
        setEntries((previous) => [item, ...previous]);
        setModalOpen(false);
        setName("");
        setEmail("");
        toast.success("Profile saved.");
    };

    const onDelete = async (id, profileName) => {
        const confirmed = await confirm({
            title: "Delete profile?",
            body: <>Delete <strong>{profileName}</strong>? This cannot be undone.</>,
            confirmText: "Delete",
            cancelText: "Cancel",
            tone: "danger",
        });
        if (confirmed) {
            setEntries((previous) => previous.filter((entry) => entry.id !== id));
            toast.info("Profile deleted.");
        }
    };

    const onClearAll = async () => {
        if (!entries.length) return;
        const confirmed = await confirm({
            title: "Clear all profiles?",
            body: <>This will remove <strong>{entries.length}</strong> profiles permanently.</>,
            confirmText: "Clear all",
            cancelText: "Cancel",
            tone: "danger",
        });
        if (confirmed) {
            clearEntries();
            toast.warning("All profiles cleared.");
        }
    };

    const exportEntries = () => {
        const blob = new Blob([JSON.stringify(entries, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "profiles.json";
        link.click();
        URL.revokeObjectURL(url);
    };

    return (
        <Styled.Shell>
            <Styled.Content>
                <Styled.Panel>
                    <Styled.Kicker>INTERACTION PLAYGROUND</Styled.Kicker>
                    <Styled.Title>Modal and Drawer Pro</Styled.Title>
                    <Styled.Sub>Accessible overlays with ESC and backdrop close, nested stacking, scroll lock and localStorage persistence.</Styled.Sub>
                    <Styled.Row>
                        <button onClick={() => setModalOpen(true)} ref={openerRef}>Open Modal</button>
                        <button onClick={() => setDrawerOpen(true)}>Open Drawer</button>
                    </Styled.Row>

                    <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Profile settings" initialFocus={openerRef}>
                        <div className="formFields">
                            <label className="field"><span>Display name</span><input type="text" placeholder="Ashish Ranjan" value={name} onChange={(event) => setName(event.target.value)} /></label>
                            <label className="field"><span>Email</span><input type="email" placeholder="ashish@email.com" value={email} onChange={(event) => setEmail(event.target.value)} /></label>
                            <div className="formActions"><button onClick={() => setModalOpen(false)}>Cancel</button><button onClick={handleSave}>Save profile</button></div>
                        </div>
                    </Modal>

                    <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)} side="right" title="Notifications">
                        <p className="badge">The drawer supports ESC and outside-click close.</p>
                        <div className="drawerActions"><button onClick={() => setModalOpen(true)}>Open modal on top</button><button onClick={() => setDrawerOpen(false)}>Close drawer</button></div>
                    </Drawer>
                </Styled.Panel>

                <Styled.Panel>
                    <div className="panelHeader"><div><Styled.Kicker>LOCAL STORAGE CRUD</Styled.Kicker><Styled.Title>Saved profiles</Styled.Title><Styled.Sub>Total: <strong>{stats.total}</strong>{stats.latestAt ? <> <span className="separator">•</span> Latest at: <span className="badge">{stats.latestAt}</span></> : null}</Styled.Sub></div><div className="panelActions"><button onClick={onClearAll}>Clear all</button><button onClick={exportEntries}>Export JSON</button></div></div>
                    {entries.length === 0 ? <div className="badge">No saved profiles yet. Use the modal to add one.</div> : <div className="tableWrap"><table className="table" aria-label="Saved profiles"><thead><tr><th>Index</th><th>Name</th><th>Email</th><th>Saved at</th><th>Actions</th></tr></thead><tbody>{entries.map((entry, index) => <tr key={entry.id}><td>{index + 1}.</td><td>{entry.name}</td><td>{entry.email}</td><td>{fmt(entry.ts)}</td><td><div className="actions"><button onClick={() => onDelete(entry.id, entry.name)}>Delete</button><button onClick={() => { navigator.clipboard?.writeText(JSON.stringify(entry, null, 2)); toast.info("Copied JSON to clipboard."); }}>Copy JSON</button></div></td></tr>)}</tbody></table></div>}
                </Styled.Panel>
            </Styled.Content>
        </Styled.Shell>
    );
}

export default function ModalProDemo() {
    return <ConfirmProvider><ModalProInner /></ConfirmProvider>;
}