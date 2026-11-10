import { useLayoutEffect, useRef } from "react";
import { getTopOverlay } from "./ZStackManager.js";

const focusableSelector =
    'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

export default function useDialogBehavior({
    open,
    onClose,
    closeOnEsc,
    dialogRef,
    initialFocusRef,
    stackRef,
}) {
    const onCloseRef = useRef(onClose);
    const closeOnEscRef = useRef(closeOnEsc);

    useLayoutEffect(() => {
        onCloseRef.current = onClose;
        closeOnEscRef.current = closeOnEsc;
    }, [onClose, closeOnEsc]);

    useLayoutEffect(() => {
        if (!open) return undefined;

        const dialog = dialogRef.current;
        if (!dialog) return undefined;

        const root = document.getElementById("root");
        const previousActiveElement = document.activeElement;
        const overlay = dialog.closest("[data-modalpro-overlay]");
        const releaseOverlay = stackRef.current?.setOverlay(overlay);

        const requestedFocus = initialFocusRef?.current;
        const focusTarget =
            requestedFocus && dialog.contains(requestedFocus)
                ? requestedFocus
                : dialog.querySelector("[data-dialog-close]") || dialog;
        focusTarget.focus();

        const handleKeyDown = (event) => {
            if (!stackRef.current?.isTop()) return;

            if (event.key === "Escape" && closeOnEscRef.current) {
                event.preventDefault();
                onCloseRef.current?.();
                return;
            }

            if (event.key !== "Tab") return;

            const focusableElements = Array.from(
                dialog.querySelectorAll(focusableSelector),
            ).filter((element) => !element.hidden);
            const firstElement = focusableElements[0];
            const lastElement = focusableElements[focusableElements.length - 1];

            if (!firstElement || !lastElement) {
                event.preventDefault();
                dialog.focus();
                return;
            }

            if (!dialog.contains(document.activeElement)) {
                event.preventDefault();
                (event.shiftKey ? lastElement : firstElement).focus();
            } else if (
                event.shiftKey &&
                document.activeElement === firstElement
            ) {
                event.preventDefault();
                lastElement.focus();
            } else if (
                !event.shiftKey &&
                document.activeElement === lastElement
            ) {
                event.preventDefault();
                firstElement.focus();
            }
        };

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            releaseOverlay?.();

            const remainingTopOverlay = getTopOverlay();
            if (remainingTopOverlay) {
                if (remainingTopOverlay.contains(document.activeElement)) return;

                const restoreWithinTop =
                    previousActiveElement instanceof HTMLElement &&
                    previousActiveElement.isConnected &&
                    remainingTopOverlay.contains(previousActiveElement);
                const topFocusTarget =
                    (restoreWithinTop && previousActiveElement) ||
                    remainingTopOverlay.querySelector("[data-dialog-close]") ||
                    remainingTopOverlay.querySelector('[role="dialog"]');
                topFocusTarget?.focus();
                return;
            }

            const canRestorePreviousFocus =
                previousActiveElement instanceof HTMLElement &&
                previousActiveElement !== document.body &&
                previousActiveElement.isConnected &&
                !previousActiveElement.closest("[inert]");
            const focusTarget = canRestorePreviousFocus
                ? previousActiveElement
                : root?.querySelector("main");
            focusTarget?.focus();
        };
    }, [open, dialogRef, initialFocusRef, stackRef]);
}
