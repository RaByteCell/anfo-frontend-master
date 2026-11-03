// "2026-11-03" → "03.11.2026"
export const formatDate = (iso: string) =>
  iso.slice(0, 10).split("-").reverse().join(".");
