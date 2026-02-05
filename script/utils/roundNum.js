export function roundToTwo(num) {
    if (typeof num !== 'number' || isNaN(num)) {
        throw new Error("Input must be a valid number");
    }
    return Math.round((num + Number.EPSILON) * 100) / 100;
}