
export const animateElement = (element: HTMLElement, className: string, duration: number) => {
  if (!element) return;
  
  element.classList.add(className);
  
  setTimeout(() => {
    element.classList.remove(className);
  }, duration);
};

export const animateValue = (
  start: number, 
  end: number, 
  duration: number, 
  callback: (value: number) => void
) => {
  let startTimestamp: number | null = null;
  const step = (timestamp: number) => {
    if (!startTimestamp) startTimestamp = timestamp;
    const progress = Math.min((timestamp - startTimestamp) / duration, 1);
    const currentValue = Math.floor(progress * (end - start) + start);
    
    callback(currentValue);
    
    if (progress < 1) {
      window.requestAnimationFrame(step);
    }
  };
  
  window.requestAnimationFrame(step);
};
