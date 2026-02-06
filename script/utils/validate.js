export function useValidate(callback) {
  return () => {
    let cached = callback();
    return cached;
  };
}
