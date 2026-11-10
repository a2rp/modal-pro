import React, { useId, useLayoutEffect, useRef, useState } from "react";
import { Overlay, DialogCard } from "./Styled.js";
import Portal from "./Portal.jsx";
import useScrollLock from "./useScrollLock.js";
import useDialogBehavior from "./useDialogBehavior.js";
import { acquireZ } from "./ZStackManager.js";
import { FiX } from "react-icons/fi";

export default function Modal({
    open,
    onClose,
    title = "Modal",
    closeOnEsc = true,
    closeOnBackdrop = true,
    children,
    initialFocus,
}) {
    const dialogRef = useRef(null);
    const stackRef = useRef(null);
    const [zIndex, setZIndex] = useState(1010);
    const titleId = useId();

    useScrollLock(open);

    useLayoutEffect(() => {
        if (!open) return undefined;

        const stack = acquireZ();
        stackRef.current = stack;
        setZIndex(stack.z);

        return () => {
            stack.release();
            stackRef.current = null;
        };
    }, [open]);

    useDialogBehavior({
        open,
        onClose,
        closeOnEsc,
        dialogRef,
        initialFocusRef: initialFocus,
        stackRef,
    });

    if (!open) return null;

    return (
        <Portal>
            <Overlay
                $z={zIndex}
                data-modalpro-overlay
                role="presentation"
                onMouseDown={(event) => {
                    if (
                        closeOnBackdrop &&
                        stackRef.current?.isTop() &&
                        event.target === event.currentTarget
                    ) {
                        onClose?.();
                    }
                }}
            >
                <div className="overlayCenter">
                    <DialogCard
                        ref={dialogRef}
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby={titleId}
                        tabIndex={-1}
                    >
                        <div className="dialogHeader">
                            <h3 id={titleId}>{title}</h3>
                            <button
                                type="button"
                                data-dialog-close
                                aria-label="Close modal"
                                onClick={onClose}
                            >
                                <FiX />
                            </button>
                        </div>
                        <div className="dialogBody">{children}</div>
                        <div className="dialogFooter">
                            <button type="button" onClick={onClose}>
                                Close
                            </button>
                        </div>
                    </DialogCard>
                </div>
            </Overlay>
        </Portal>
    );
}
