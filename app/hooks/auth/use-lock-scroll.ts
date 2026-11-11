import { useEffect } from "react";

// Sperrt das Scrollen der Seite, solange die Komponente sichtbar ist
export function useLockScroll() {
  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // Aufräumen: wird ausgeführt, wenn das Popup verschwindet
    return () => {
      document.body.style.overflow = previous;
    };
  }, []);
}
