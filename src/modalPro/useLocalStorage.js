import { useEffect, useRef, useState } from "react";

export default function useLocalStorage(key, initialValue) {
    const isFirst = useRef(true);
    const skipNextWrite = useRef(false);
    const [value, setValue] = useState(() => {
        try {
            const raw = localStorage.getItem(key);
            if (raw == null) return initialValue;

            const parsed = JSON.parse(raw);
            if (Array.isArray(initialValue)) {
                return Array.isArray(parsed) ? parsed : initialValue;
            }
            return parsed;
        } catch {
            return initialValue;
        }
    });

    useEffect(() => {
        if (isFirst.current) {
            isFirst.current = false;
            return;
        }
        if (skipNextWrite.current) {
            skipNextWrite.current = false;
            return;
        }
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch {
            return;
        }
    }, [key, value]);

    const clear = () => {
        try {
            localStorage.removeItem(key);
        } catch {
            return;
        }
        if (!Object.is(value, initialValue)) skipNextWrite.current = true;
        setValue(initialValue);
    };

    return [value, setValue, clear];
}
