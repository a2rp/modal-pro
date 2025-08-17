let base = 1000;
let step = 10;
let current = 0;

export function acquireZ() {
    current += 1;
    const z = base + current * step;
    const release = () => {
        current = Math.max(0, current - 1);
    };
    return { z, release };
}
