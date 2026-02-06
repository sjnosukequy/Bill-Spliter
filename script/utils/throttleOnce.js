export function throttleOnce(fn, delay = 700) {
  let isRunning = false;

  return function (...args) {
    if (isRunning) return;

    isRunning = true;
    fn.apply(this, args);

    setTimeout(() => {
      isRunning = false;
    }, delay);
  };
}
