import { useEffect } from "react";

export default function useScrollLock(enabled) {
    useEffect(() => {
        if (!enabled) return;
        const html = document.documentElement;
        const prev = html.className;
        html.classList.add("modalpro-lock");
        return () => {
            html.className = prev;
        };
    }, [enabled]);
}
