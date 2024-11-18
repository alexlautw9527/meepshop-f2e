import { useEffect, RefObject } from 'react';

export function useClickOutside(
  ref: RefObject<HTMLElement>,
  handler: (event: MouseEvent) => void,
  enabled = true
): void {
  useEffect(() => {
    if (!enabled) {
      return undefined;
    }

    const listener = (event: MouseEvent): void => {
      if (!ref.current || ref.current.contains(event.target as Node)) {
        return;
      }
      handler(event);
    };

    document.addEventListener('mousedown', listener);
    return () => {
      document.removeEventListener('mousedown', listener);
    };
  }, [ref, handler, enabled]);
}

export default useClickOutside;
