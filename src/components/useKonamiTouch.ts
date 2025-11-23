import { useEffect, useRef } from "react";

// Define a sequence of swipe/tap gestures for the Konami code
const KONAMI_TOUCH = [
  "up",
  "up",
  "down",
  "down",
  "left",
  "right",
  "left",
  "right",
  "tap",
  "tap",
];

type Point = { x: number; y: number };

export function useKonamiTouch(onSuccess: () => void) {
  const indexRef = useRef(0);
  const touchStartRef = useRef<Point | null>(null);

  useEffect(() => {
    const threshold = 50; // Minimum px for swipe

    const onTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0];
      touchStartRef.current = { x: touch.clientX, y: touch.clientY };
    };

    const onTouchEnd = (e: TouchEvent) => {
      if (!touchStartRef.current) return;
      const touch = e.changedTouches[0];
      const dx = touch.clientX - touchStartRef.current.x;
      const dy = touch.clientY - touchStartRef.current.y;

      let gesture: string;
      if (Math.abs(dx) < 10 && Math.abs(dy) < 10) {
        gesture = "tap";
      } else if (Math.abs(dx) > Math.abs(dy)) {
        gesture = dx > threshold ? "right" : dx < -threshold ? "left" : "";
      } else {
        gesture = dy > threshold ? "down" : dy < -threshold ? "up" : "";
      }

      if (gesture && gesture === KONAMI_TOUCH[indexRef.current]) {
        indexRef.current += 1;
        if (indexRef.current === KONAMI_TOUCH.length) {
          onSuccess();
          indexRef.current = 0;
        }
      } else if (gesture) {
        indexRef.current = 0;
      }
      touchStartRef.current = null;
    };

    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });

    return () => {
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }, [onSuccess]);
}
