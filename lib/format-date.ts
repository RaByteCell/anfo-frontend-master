// "2026-11-03" → "03.11.2026"
// DATUMSFORMATIERUNG: Wandelt ein Datum vom internationalen Format (JJJJ-MM-TT) in das deutsche Format (TT.MM.JJJJ) um.
export const formatDate = (iso: string) =>
  iso.slice(0, 10).split("-").reverse().join(".");
