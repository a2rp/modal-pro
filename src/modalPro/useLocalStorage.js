import { useEffect, useRef, useState } from "react";

export default function useLocalStorage(key, initialValue) {
    const isFirst = useRef(true);
    const [value, setValue] = useState(() => {
        try {
            const raw = localStorage.getItem(key);
            return raw != null ? JSON.parse(raw) : initialValue;
        } catch {
            return initialValue;
        }
    });

    useEffect(() => {
        if (isFirst.current) {
            isFirst.current = false;
            return;
        }
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch {}
    }, [key, value]);

    const clear = () => {
        try {
            localStorage.removeItem(key);
        } catch {}
        setValue(initialValue);
    };

    return [value, setValue, clear];
}
