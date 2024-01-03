/**
 * @param {CallableFunction} func - Function to call after debounce delay
 * @param {number} delay - Time in seconds to delay function execution
 */
let timeout: NodeJS.Timeout;
export const debounce = (func: () => void, delay: number = 2) => {
  if (timeout) {
    clearTimeout(timeout);
  }

  timeout = setTimeout(func, delay * 1000);
  return timeout;
};
