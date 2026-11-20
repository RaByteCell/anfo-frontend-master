// Importiert Axios für die Kommunikation mit der Strapi-Schnittstelle (API).
import axios from "axios";
// Wie axios, erneuert aber abgelaufene Tokens automatisch.
import { api as authApi } from "./api";
// Importiert React Query für das Laden, Speichern und Aktualisieren von Daten.
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
// Importiert die Datentypen für neue und bereits gespeicherte Kontakte.
import type { Contact, ContactInput } from "./contact-zod-schema";
// API-VERBINDUNG: Legt fest, unter welcher Adresse Strapi erreichbar ist.
// Falls keine eigene Adresse hinterlegt ist, wird die lokale Standardadresse verwendet.
export const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:1337/api";
const api = axios.create({ baseURL: API_URL });
// DATENKENNUNG: Dient dazu, die gespeicherten Kontakte in React Query eindeutig zuzuordnen.
const KEY = ["anfo_contacts"];
// KONTAKTE LADEN: Ruft alle gespeicherten Kontakte aus Strapi ab.
export const useContacts = () =>
  useQuery({
    queryKey: KEY,
    queryFn: async () =>
      (
        await api.get<{ data: Contact[] }>("/anfo-contacts", {
          params: {
            populate: "profilepicture",
            sort: "createdAt:desc",
            "pagination[pageSize]": 100,
          },
        })
      ).data.data,
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
