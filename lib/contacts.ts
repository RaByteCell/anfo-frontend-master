// Importiert Axios für die Kommunikation mit der Strapi-Schnittstelle (API).
import axios from "axios";
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
// KONTAKT ERSTELLEN: Übermittelt einen neuen Kontakt an Strapi und speichert ihn dort.
export const useCreateContact = () =>
  useContactMutation((data: ContactInput) =>
    api.post("/anfo-contacts", { data }),
  );
// KONTAKT BEARBEITEN: Aktualisiert einen bestehenden Kontakt anhand seiner Dokument-ID.
export const useUpdateContact = () =>
  useContactMutation(
    ({ documentId, data }: { documentId: string; data: ContactInput }) =>
      api.put(`/anfo-contacts/${documentId}`, { data }),
  );
// KONTAKT LÖSCHEN: Entfernt einen bestehenden Kontakt anhand seiner Dokument-ID aus Strapi.
export const useDeleteContact = () =>
  useContactMutation((documentId: string) =>
    api.delete(`/anfo-contacts/${documentId}`),
  );
