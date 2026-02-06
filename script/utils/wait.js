export function wait(ms) {
    return new Promise((resolve, reject) => {
        // Input validation
        if (typeof ms !== 'number' || ms < 0 || !Number.isFinite(ms)) {
            return reject(new Error("Invalid delay time. Must be a non-negative number."));
        }
        setTimeout(resolve, ms);
    });
}