import axios from "axios";

// Wie axios, erneuert aber abgelaufene Tokens automatisch.
export const api = axios.create();

// Laufende Erneuerung, damit nie zwei gleichzeitig starten.
let refreshPromise: Promise<unknown> | null = null;

// Prüft jede Antwort, bevor sie beim Rest der App ankommt.
api.interceptors.response.use(
  // Anfrage erfolgreich: Antwort unverändert weitergeben.
  (response) => response,
  // Anfrage fehlgeschlagen:
  async (error) => {
    const request = error.config; // Die fehlgeschlagene Anfrage

    // Nur bei 401 und nur einmal pro Anfrage erneuern.
    if (error.response?.status !== 401 || request._retried) {
      throw error;
    }
    request._retried = true; // Merkt sich den Versuch, damit keine Endlosschleife entsteht.

    // Neues Token holen. Läuft das schon, wird diese Erneuerung mitbenutzt.
    refreshPromise ??= axios.post("/api/auth/refresh").finally(() => {
      refreshPromise = null; // Danach wieder freigeben.
    });
    await refreshPromise; // Warten, bis das neue Token da ist.

    // Ursprüngliche Anfrage mit neuem Token wiederholen.
    return api(request);
  },
);
