// Adresse der API und Bauplan eines Kontakts aus den eigenen Dateien.
import { API_URL } from "./contacts";
import type { Contact } from "./contact-zod-schema";
// Grundadresse von Strapi (Backend): entfernt das "/api" am Ende, weil Bilder nicht unter /api liegen.
// "http://localhost:1337/api" → "http://localhost:1337"
const STRAPI_URL = API_URL.replace(/\/api$/, "");
// Ersatzbild für Kontakte ohne eigenes Profilbild.
const PLACEHOLDER = `${STRAPI_URL}/uploads/Portrait_Placeholder_5d8af8e14d.png`;
// Hilfsfunktion: macht aus "/uploads/..." eine volle Adresse
const toFullUrl = (url: string) =>
  url.startsWith("http") ? url : `${STRAPI_URL}${url}`;
// Zur Anzeige in der Tabelle: kleine Version, sonst Platzhalter
export const getPictureUrl = (contact: Contact) => {
  const picture = contact.profilepicture;
  if (!picture) return PLACEHOLDER;
  return toFullUrl(picture.formats?.thumbnail?.url ?? picture.url);
};
// Zum Herunterladen: immer das Original
export async function downloadPicture(contact: Contact) {
  if (!contact.profilepicture) return;
  const blob = await (
    await fetch(toFullUrl(contact.profilepicture.url))
  ).blob();
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = contact.profilepicture.name;
  link.click();
  URL.revokeObjectURL(link.href);
}
