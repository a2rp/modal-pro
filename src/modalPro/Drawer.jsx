import React, { useEffect, useRef } from "react";
import { Overlay, DrawerPanel } from "./Styled.js";
import Portal from "./Portal.jsx";
import useScrollLock from "./useScrollLock.js";
import { acquireZ } from "./ZStackManager.js";

export default function Drawer({
    open,
    onClose,
    side = "right",
    title = "Drawer",
    closeOnEsc = true,
    closeOnBackdrop = true,
    children,
}) {
    const panelRef = useRef(null);
    const zRef = useRef({ z: 0, release: () => { } });

    useScrollLock(open);

    useEffect(() => {
        if (open) zRef.current = acquireZ();
        return () => zRef.current.release();
    }, [open]);

    useEffect(() => {
        if (!open || !closeOnEsc) return;
        const onKey = (e) => { if (e.key === "Escape") onClose?.(); };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [open, closeOnEsc, onClose]);

    if (!open) return null;

    return (
        <Portal>
            <Overlay
                $z={zRef.current.z}
                role="presentation"
                onMouseDown={(e) => {
                    if (!closeOnBackdrop) return;
                    if (e.target === e.currentTarget) onClose?.();
                }}
            >
                <DrawerPanel
                    $side={side}
                    $open={open}
                    ref={panelRef}
                    role="dialog"
                    aria-modal="true"
                    aria-label={typeof title === "string" ? title : undefined}
                    onMouseDown={(e) => e.stopPropagation()}
                >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8, marginBottom: 8 }}>
                        <h3 style={{ margin: 0 }}>{title}</h3>
                        <button aria-label="Close" onClick={onClose}>✕</button>
                    </div>
                    <div style={{ color: "var(--muted)" }}>
                        {children}
                    </div>
                </DrawerPanel>
            </Overlay>
        </Portal>
    );
}
