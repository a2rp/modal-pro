import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import Modal from "./Modal.jsx";

const ConfirmCtx = createContext(null);

export function ConfirmProvider({ children }) {
    const [state, setState] = useState({ open: false, options: {} });
    const resolverRef = useRef(() => { });

    const confirm = useCallback((options = {}) => {
        return new Promise((resolve) => {
            resolverRef.current?.(false);
            resolverRef.current = resolve;
            setState({ open: true, options });
        });
    }, []);

    const handleClose = useCallback((result) => {
        const resolver = resolverRef.current;
        resolverRef.current = () => { };
        resolver?.(result);
        setState({ open: false, options: {} });
    }, []);

    const cancelConfirmation = useCallback(
        () => handleClose(false),
        [handleClose],
    );

    useEffect(
        () => () => {
            resolverRef.current?.(false);
            resolverRef.current = () => { };
        },
        [],
    );

    const {
        title = "Are you sure?",
        body = "This action cannot be undone.",
        confirmText = "Confirm",
        cancelText = "Cancel",
        tone = "neutral", // "neutral" | "danger"
    } = state.options || {};

    return (
        <ConfirmCtx.Provider value={confirm}>
            {children}

            <Modal
                open={state.open}
                onClose={cancelConfirmation}
                title={title}
                closeOnEsc
                closeOnBackdrop
            >
                <div style={{ marginTop: 10, color: "var(--muted)" }}>
                    {typeof body === "string" ? (
                        <p style={{ marginTop: 0 }}>{body}</p>
                    ) : (
                        body
                    )}
                </div>

                <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 12 }}>
                    <button type="button" onClick={() => handleClose(false)}>{cancelText}</button>
                    <button
                        type="button"
                        onClick={() => handleClose(true)}
                        style={{
                            background: tone === "danger" ? "rgba(220,38,38,0.30)" : "rgba(255,255,255,0.06)",
                            borderColor: tone === "danger" ? "#7a1d1d" : "var(--border)",
                        }}
                    >
                        {confirmText}
                    </button>
                </div>
            </Modal>
        </ConfirmCtx.Provider>
    );
}

export function useConfirm() {
    const ctx = useContext(ConfirmCtx);
    if (!ctx) throw new Error("useConfirm must be used inside <ConfirmProvider>");
    return ctx;
}
