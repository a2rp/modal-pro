const baseZIndex = 1000;
const zIndexStep = 10;
let nextId = 0;
const activeEntries = [];
let rootSnapshot = null;
const overlaySnapshots = new Map();

function restoreElement(element, snapshot) {
    if (!element || !snapshot) return;
    element.inert = snapshot.inert;
    if (snapshot.ariaHidden === null) {
        element.removeAttribute("aria-hidden");
    } else {
        element.setAttribute("aria-hidden", snapshot.ariaHidden);
    }
}

function synchronizeInertState() {
    const root = document.getElementById("root");

    if (activeEntries.length === 0) {
        restoreElement(root, rootSnapshot);
        rootSnapshot = null;
        overlaySnapshots.forEach((snapshot, overlay) => {
            restoreElement(overlay, snapshot);
        });
        overlaySnapshots.clear();
        return;
    }

    if (root && !rootSnapshot) {
        rootSnapshot = {
            inert: root.inert,
            ariaHidden: root.getAttribute("aria-hidden"),
        };
    }
    if (root) {
        root.inert = true;
        root.setAttribute("aria-hidden", "true");
    }

    const topOverlay = activeEntries.at(-1)?.overlay;
    activeEntries.forEach(({ overlay }) => {
        if (!overlay) return;
        if (!overlaySnapshots.has(overlay)) {
            overlaySnapshots.set(overlay, {
                inert: overlay.inert,
                ariaHidden: overlay.getAttribute("aria-hidden"),
            });
        }
        const isBackground = overlay !== topOverlay;
        const snapshot = overlaySnapshots.get(overlay);
        overlay.inert = isBackground || snapshot.inert;
        if (isBackground) {
            overlay.setAttribute("aria-hidden", "true");
        } else {
            if (snapshot.ariaHidden === null) {
                overlay.removeAttribute("aria-hidden");
            } else {
                overlay.setAttribute("aria-hidden", snapshot.ariaHidden);
            }
        }
    });
}

export function acquireZ() {
    const entry = { id: ++nextId };
    activeEntries.push(entry);
    let released = false;

    return {
        z: baseZIndex + entry.id * zIndexStep,
        isTop: () =>
            !released && activeEntries[activeEntries.length - 1] === entry,
        setOverlay: (overlay) => {
            if (released || !overlay) return () => {};
            entry.overlay = overlay;
            synchronizeInertState();
            let overlayReleased = false;
            return () => {
                if (overlayReleased) return;
                overlayReleased = true;
                if (entry.overlay === overlay) entry.overlay = null;
                if (!activeEntries.includes(entry)) {
                    restoreElement(overlay, overlaySnapshots.get(overlay));
                    overlaySnapshots.delete(overlay);
                }
                synchronizeInertState();
            };
        },
        release: () => {
            if (released) return;
            released = true;
            const index = activeEntries.indexOf(entry);
            if (index !== -1) activeEntries.splice(index, 1);
            if (entry.overlay && !activeEntries.includes(entry)) {
                restoreElement(
                    entry.overlay,
                    overlaySnapshots.get(entry.overlay),
                );
                overlaySnapshots.delete(entry.overlay);
                entry.overlay = null;
            }
            synchronizeInertState();
        },
    };
}

export function getTopOverlay() {
    return activeEntries.at(-1)?.overlay ?? null;
}
