import { useEffect, useRef } from "react";

const KONAMI_CODE = [
  "ArrowUp", "ArrowUp",
  "ArrowDown", "ArrowDown",
  "ArrowLeft", "ArrowRight",
  "ArrowLeft", "ArrowRight",
  "b", "a"
];

export function useKonamiCode(onSuccess: () => void) {
  const indexRef = useRef(0);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === KONAMI_CODE[indexRef.current]) {
        indexRef.current += 1;
        if (indexRef.current === KONAMI_CODE.length) {
          onSuccess();
          indexRef.current = 0;
        }
      } else {
        indexRef.current = 0;
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onSuccess]);
}
