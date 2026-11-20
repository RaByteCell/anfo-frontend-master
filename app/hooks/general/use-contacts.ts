// Importiert Axios für die Kommunikation mit der Strapi-Schnittstelle (API).
import axios from "axios";
// Wie axios, erneuert aber abgelaufene Tokens automatisch.
import { api as authApi } from "../../../lib/api";
// Importiert React Query für das Laden, Speichern und Aktualisieren von Daten.
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
// Importiert die Datentypen für neue und bereits gespeicherte Kontakte.
import type { Contact, ContactInput } from "../../../lib/contact-zod-schema";
// API-VERBINDUNG: Legt fest, unter welcher Adresse Strapi erreichbar ist.
// Falls keine eigene Adresse hinterlegt ist, wird die lokale Standardadresse verwendet.
export const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:1337/api";
const api = axios.create({ baseURL: API_URL });
// DATENKENNUNG: Dient dazu, die gespeicherten Kontakte in React Query eindeutig zuzuordnen.
const KEY = ["anfo_contacts"];

// Antwort von Strapi bei Listen: die Einträge und Infos zu den Seiten.
type ContactList = {
  data: Contact[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
};

// KONTAKTE LADEN: die neuesten 50 für die Startseite, dazu die Gesamtzahl.
export const useContacts = () =>
  useQuery({
    queryKey: KEY,
    queryFn: async () =>
      (
        await api.get<ContactList>("/anfo-contacts", {
          params: {
            populate: "profilepicture",
            sort: "createdAt:desc",
            "pagination[pageSize]": 50,
          },
        })
      ).data,
  });

// Wie viele eigene Kontakte die Startseite höchstens zeigt. Freie Plätze füllen die neuesten fremden.
export const OWN_ON_START = 4;

// EIGENE KONTAKTE: nur die des angemeldeten Benutzers, alphabetisch (für die Startseite).
export const useOwnContacts = (userId?: number) =>
  useQuery({
    queryKey: [...KEY, "own", userId],
    enabled: userId !== undefined, // nur laden, wenn jemand angemeldet ist
    queryFn: async () =>
      (
        await api.get<ContactList>("/anfo-contacts", {
          params: {
            populate: "profilepicture",
            "filters[ownerId][$eq]": userId,
            "sort[0]": "nachname:asc",
            "sort[1]": "vorname:asc",
            "pagination[pageSize]": OWN_ON_START,
          },
        })
      ).data,
  });

// Wie viele Kontakte "Alle Kontakte" pro Seite zeigt.
export const PAGE_SIZE = 10;
// In diesen Feldern sucht die Suche.
const SEARCH_FIELDS = ["vorname", "nachname", "adresse", "plz", "email"];

// FILTER: was im Filter-Fenster eingestellt werden kann. Leer heißt: nicht filtern.
export type ContactFilters = {
  year: string; // Geburtsjahr, z. B. "1990"
  month: string; // Geburtsmonat 1–12, nur zusammen mit dem Jahr
  day: string; // Geburtstag 1–31, nur zusammen mit Jahr und Monat
  plz: string; // PLZ beginnt mit diesem Text
  picture: "all" | "with" | "without"; // Profilbild egal / vorhanden / nicht vorhanden
};
// Keine Filter gesetzt.
export const EMPTY_FILTERS: ContactFilters = {
  year: "",
  month: "",
  day: "",
  plz: "",
  picture: "all",
};

// Zählt, wie viele Filter gesetzt sind (Geburtsdatum zählt als einer).
export function countActiveFilters(filters: ContactFilters) {
  return [filters.year, filters.plz, filters.picture !== "all"].filter(Boolean)
    .length;
}

// Macht aus einer Zahl eine zweistellige Angabe: 4 → "04".
const pad = (n: number) => String(n).padStart(2, "0");

// GEBURTSDATUM: Aus Jahr, Monat und Tag wird ein Zeitraum von–bis.
// Nur Jahr: das ganze Jahr. Jahr und Monat: der ganze Monat. Alle drei: genau dieser Tag.
export function birthDateRange(filters: ContactFilters) {
  if (!filters.year) return null;
  const year = Number(filters.year);
  if (!filters.month) return [`${year}-01-01`, `${year}-12-31`];
  const month = Number(filters.month);
  if (filters.day) {
    const date = `${year}-${pad(month)}-${pad(Number(filters.day))}`;
    return [date, date];
  }
  // Tag 0 des Folgemonats ist der letzte Tag dieses Monats.
  const lastDay = new Date(year, month, 0).getDate();
  return [`${year}-${pad(month)}-01`, `${year}-${pad(month)}-${pad(lastDay)}`];
}

// Gemeinsamer Typ für die Einstellungen, die an Strapi gehen.
type Params = Record<string, string | number | boolean>;

// SUCHE: findet Kontakte, bei denen irgendein Feld den Text enthält (Groß/klein egal).
function searchFilter(search: string) {
  const params: Params = {};
  if (search) {
    SEARCH_FIELDS.forEach((field, i) => {
      params[`filters[$and][1][$or][${i}][${field}][$containsi]`] = search;
    });
  }
  return params;
}

// FILTER FÜR STRAPI: Jeder gesetzte Filter wird eine weitere Bedingung im "und".
function filterParams(filters: ContactFilters) {
  const params: Params = {};
  const range = birthDateRange(filters);
  if (range) {
    params["filters[$and][2][bdate][$gte]"] = range[0];
    params["filters[$and][2][bdate][$lte]"] = range[1];
  }
  if (filters.plz.trim()) {
    params["filters[$and][3][plz][$startsWith]"] = filters.plz.trim();
  }
  if (filters.picture === "with") {
    params["filters[$and][4][profilepicture][id][$notNull]"] = true;
  }
  if (filters.picture === "without") {
    params["filters[$and][4][profilepicture][id][$null]"] = true;
  }
  return params;
}

// Antwort von Strapi bei "ab Stelle X, höchstens Y Stück": Einträge und Gesamtzahl.
type ContactSlice = {
  data: Contact[];
  meta: { pagination: { start: number; limit: number; total: number } };
};

// Holt einen Ausschnitt: ab "start" höchstens "limit" Kontakte.
async function fetchSlice(params: Params, start: number, limit: number) {
  const { data } = await api.get<ContactSlice>("/anfo-contacts", {
    params: {
      populate: "profilepicture",
      ...params,
      "pagination[start]": start,
      "pagination[limit]": limit,
    },
  });
  return data;
}

// EINE SEITE LADEN: zuerst alle eigenen Kontakte (alphabetisch), danach die übrigen (neueste zuerst).
// Suche und Filter gelten für beide Teile.
export const useContactsPage = (
  page: number,
  search: string,
  userId?: number,
  filters: ContactFilters = EMPTY_FILTERS,
) =>
  useQuery({
    queryKey: [...KEY, "page", page, search, userId, filters],
    queryFn: async () => {
      // An welcher Stelle der Gesamtliste diese Seite beginnt.
      const start = (page - 1) * PAGE_SIZE;
      // Suche und Filter, die für eigene und übrige gleich sind.
      const shared: Params = {
        ...searchFilter(search),
        ...filterParams(filters),
      };

      // 1. EIGENE: nur, wenn jemand angemeldet ist.
      const empty: ContactSlice = {
        data: [],
        meta: { pagination: { start, limit: 0, total: 0 } },
      };
      const own =
        userId === undefined
          ? empty
          : await fetchSlice(
              {
                "filters[$and][0][ownerId][$eq]": userId,
                "sort[0]": "nachname:asc",
                "sort[1]": "vorname:asc",
                ...shared,
              },
              start,
              PAGE_SIZE,
            );
      const ownTotal = own.meta.pagination.total;

      // 2. ÜBRIGE: füllen die Seite auf. In der Gesamtliste beginnen sie erst nach den eigenen.
      // Dazu zählen auch Kontakte ganz ohne Besitzer ($null).
      const missing = PAGE_SIZE - own.data.length;
      const othersFilter: Params =
        userId === undefined
          ? {}
          : {
              "filters[$and][0][$or][0][ownerId][$ne]": userId,
              "filters[$and][0][$or][1][ownerId][$null]": true,
            };
      const others = await fetchSlice(
        { ...othersFilter, sort: "createdAt:desc", ...shared },
        Math.max(0, start - ownTotal),
        Math.max(missing, 1),
      );

      // Beides zusammen ergibt die Seite, die Gesamtzahl gilt für die Seitenanzeige.
      const total = ownTotal + others.meta.pagination.total;
      return {
        data: [...own.data, ...(missing > 0 ? others.data : [])],
        meta: {
          pagination: {
            page,
            pageSize: PAGE_SIZE,
            pageCount: Math.ceil(total / PAGE_SIZE),
            total,
          },
        },
      };
    },
    // Die alte Seite bleibt sichtbar, bis die neue geladen ist (kein Flackern).
    placeholderData: keepPreviousData,
  });

// GEMEINSAME FUNKTION: Führt eine Datenänderung aus und aktualisiert anschließend die Kontaktliste.
// Dadurch werden neue, bearbeitete oder gelöschte Einträge automatisch in der Tabelle angezeigt.
function useContactMutation<V>(action: (vars: V) => Promise<unknown>) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: action,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: KEY }),
  });
}
// KONTAKT ERSTELLEN: Über die eigene Route, damit das Login-Token mitgeht.
export const useCreateContact = () =>
  useContactMutation((data: ContactInput) =>
    authApi.post("/api/contacts", { data }),
  );
// BILD HOCHLADEN: Schickt die Datei an Strapi und gibt ihre ID zurück.
async function uploadPicture(file: File) {
  const formData = new FormData();
  formData.append("files", file); // Strapi erwartet die Datei unter dem Namen "files".
  const { data } = await authApi.post<{ id: number }[]>(
    "/api/upload",
    formData,
  );
  return data[0].id;
}

// KONTAKT BEARBEITEN: Lädt zuerst ein neues Bild hoch (falls gewählt), dann die Daten.
export const useUpdateContact = () =>
  useContactMutation(
    async ({
      documentId,
      data,
      picture,
    }: {
      documentId: string;
      data: ContactInput;
      picture?: File | null;
    }) => {
      const profilepicture = picture ? await uploadPicture(picture) : undefined;
      return authApi.put(`/api/contacts/${documentId}`, {
        data: profilepicture ? { ...data, profilepicture } : data,
      });
    },
  );
// KONTAKT LÖSCHEN: Über die eigene Route, damit das Login-Token mitgeht.
export const useDeleteContact = () =>
  useContactMutation((documentId: string) =>
    authApi.delete(`/api/contacts/${documentId}`),
  );
