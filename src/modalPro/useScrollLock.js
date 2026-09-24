import { useEffect } from "react";

let lockCount = 0;
let previousOverflow = "";

export default function useScrollLock(enabled) {
    useEffect(() => {
        if (!enabled) return undefined;
        const html = document.documentElement;
        if (lockCount === 0) previousOverflow = html.style.overflow;
        lockCount += 1;
        html.classList.add("modalpro-lock");
        return () => {
            lockCount = Math.max(0, lockCount - 1);
            if (lockCount === 0) {
                html.style.overflow = previousOverflow;
                html.classList.remove("modalpro-lock");
            }
        };
    }, [enabled]);
}