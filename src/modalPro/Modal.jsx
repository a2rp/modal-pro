import React, { useEffect, useRef, useState } from "react";
import { Overlay, DialogCard } from "./Styled.js";
import Portal from "./Portal.jsx";
import useScrollLock from "./useScrollLock.js";
import { acquireZ } from "./ZStackManager.js";
import { FiX } from "react-icons/fi";

export default function Modal({ open, onClose, title = "Modal", closeOnEsc = true, closeOnBackdrop = true, children, initialFocus }) {
    const closeRef = useRef(null);
    const [zIndex, setZIndex] = useState(1010);
    useScrollLock(open);

    useEffect(() => {
        if (!open) return undefined;
        const stack = acquireZ();
        setZIndex(stack.z);
        return () => stack.release();
    }, [open]);

    useEffect(() => {
        if (!open) return undefined;
        const handleKey = (event) => { if (event.key === "Escape" && closeOnEsc) onClose?.(); };
        window.addEventListener("keydown", handleKey);
        const focusTarget = closeRef.current || initialFocus?.current;
        focusTarget?.focus?.();
        return () => window.removeEventListener("keydown", handleKey);
    }, [open, closeOnEsc, onClose, initialFocus]);

    if (!open) return null;

    return <Portal><Overlay $z={zIndex} role="presentation" onMouseDown={(event) => { if (closeOnBackdrop && event.target === event.currentTarget) onClose?.(); }}><div className="overlayCenter"><DialogCard role="dialog" aria-modal="true" aria-label={typeof title === "string" ? title : undefined} onMouseDown={(event) => event.stopPropagation()}><div className="dialogHeader"><h3>{title}</h3><button ref={closeRef} aria-label="Close modal" onClick={onClose}><FiX /></button></div><div className="dialogBody">{children}</div><div className="dialogFooter"><button onClick={onClose}>Close</button></div></DialogCard></div></Overlay></Portal>;
}