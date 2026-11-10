import React, { useCallback, useMemo, useRef, useState } from "react";
import { Styled } from "./Styled.js";
import Modal from "./Modal.jsx";
import Drawer from "./Drawer.jsx";
import useLocalStorage from "./useLocalStorage.js";
import { toast } from "react-toastify";
import { ConfirmProvider, useConfirm } from "./useConfirm.jsx";

const timestampFormatter = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Kolkata",
    month: "short",
    day: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
});

const normalizeEmail = (value) => value.trim().toLowerCase();
const isProfile = (entry) =>
    entry &&
    typeof entry.id === "string" &&
    typeof entry.name === "string" &&
    typeof entry.email === "string" &&
    Number.isFinite(entry.ts);
const formatTimestamp = (timestamp) =>
    timestampFormatter.format(new Date(timestamp));

function ModalProInner() {
    const [modalOpen, setModalOpen] = useState(false);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [storedEntries, setEntries, clearEntries] = useLocalStorage("modalpro:profiles", []);
    const entries = useMemo(
        () => (Array.isArray(storedEntries) ? storedEntries.filter(isProfile) : []),
        [storedEntries],
    );
    const nameInputRef = useRef(null);
    const confirm = useConfirm();

    const stats = useMemo(() => ({
        total: entries.length,
        latestAt: entries[0]?.ts ? formatTimestamp(entries[0].ts) : null,
    }), [entries]);

    const closeProfileModal = useCallback(() => setModalOpen(false), []);
    const closeDrawer = useCallback(() => setDrawerOpen(false), []);

    const handleSave = (event) => {
        event.preventDefault();
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
        setEntries((previous) => [
            item,
            ...(Array.isArray(previous) ? previous.filter(isProfile) : []),
        ]);
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
            setEntries((previous) =>
                (Array.isArray(previous) ? previous : []).filter(
                    (entry) => isProfile(entry) && entry.id !== id,
                ),
            );
            toast.info("Profile deleted.");
        }
    };

    const onClearAll = async () => {
        if (!entries.length) {
            clearEntries();
            return;
        }
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
        window.setTimeout(() => URL.revokeObjectURL(url), 0);
    };

    const copyEntry = async (entry) => {
        try {
            if (!navigator.clipboard?.writeText) {
                throw new Error("Clipboard access is unavailable.");
            }
            await navigator.clipboard.writeText(JSON.stringify(entry, null, 2));
            toast.success("Copied JSON to clipboard.");
        } catch {
            toast.error("Clipboard access is unavailable in this browser.");
        }
    };

    return (
        <Styled.Shell>
            <Styled.Content>
                <Styled.Panel>
                    <Styled.Kicker>INTERACTION PLAYGROUND</Styled.Kicker>
                    <Styled.Title>Modal and Drawer Pro</Styled.Title>
                    <Styled.Sub>Accessible overlays with focus handling, nested stacking, scroll lock and browser-only profile storage.</Styled.Sub>
                    <Styled.Row>
                        <button type="button" onClick={() => setModalOpen(true)}>Open Modal</button>
                        <button type="button" onClick={() => setDrawerOpen(true)}>Open Drawer</button>
                    </Styled.Row>

                    <Modal open={modalOpen} onClose={closeProfileModal} title="Profile settings" initialFocus={nameInputRef}>
                        <form className="formFields" onSubmit={handleSave}>
                            <label className="field"><span>Display name</span><input ref={nameInputRef} type="text" placeholder="Ashish Ranjan" autoComplete="name" required value={name} onChange={(event) => setName(event.target.value)} /></label>
                            <label className="field"><span>Email</span><input type="email" placeholder="ashish@email.com" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} /></label>
                            <div className="formActions"><button type="button" onClick={closeProfileModal}>Cancel</button><button type="submit">Save profile</button></div>
                        </form>
                    </Modal>

                    <Drawer open={drawerOpen} onClose={closeDrawer} side="right" title="Notifications">
                        <p className="badge">The drawer supports ESC and outside-click close.</p>
                        <div className="drawerActions"><button type="button" onClick={() => setModalOpen(true)}>Open modal on top</button><button type="button" onClick={closeDrawer}>Close drawer</button></div>
                    </Drawer>
                </Styled.Panel>

                <Styled.Panel>
                    <div className="panelHeader"><div><Styled.Kicker>LOCAL STORAGE CRUD</Styled.Kicker><Styled.Title>Saved profiles</Styled.Title><Styled.Sub>Total: <strong>{stats.total}</strong>{stats.latestAt ? <> <span className="separator">•</span> Latest at: <span className="badge">{stats.latestAt}</span></> : null}</Styled.Sub></div><div className="panelActions"><button type="button" onClick={onClearAll}>Clear all</button><button type="button" onClick={exportEntries} disabled={entries.length === 0}>Export JSON</button></div></div>
                    {entries.length === 0 ? <div className="badge">No saved profiles yet. Use the modal to add one.</div> : <div className="tableWrap"><table className="table" aria-label="Saved profiles"><thead><tr><th>Index</th><th>Name</th><th>Email</th><th>Saved at</th><th>Actions</th></tr></thead><tbody>{entries.map((entry, index) => <tr key={entry.id}><td>{index + 1}.</td><td>{entry.name}</td><td>{entry.email}</td><td>{formatTimestamp(entry.ts)}</td><td><div className="actions"><button type="button" onClick={() => onDelete(entry.id, entry.name)}>Delete</button><button type="button" onClick={() => copyEntry(entry)}>Copy JSON</button></div></td></tr>)}</tbody></table></div>}
                </Styled.Panel>
            </Styled.Content>
        </Styled.Shell>
    );
}

export default function ModalProDemo() {
    return <ConfirmProvider><ModalProInner /></ConfirmProvider>;
}
