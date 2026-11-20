import type { AuthUser } from "@/app/hooks/auth/use-get-user";
import type { Contact } from "./contact-zod-schema";

// RECHTE PRO ROLLE: Was jede Rolle im Frontend darf. Neue Rolle = neue Zeile.
const rights: Record<string, { manageAllContacts: boolean }> = {
  authenticated: { manageAllContacts: false },
  admin: { manageAllContacts: true },
};

// Holt die Rechte des Benutzers. Unbekannte Rolle: keine Extra-Rechte.
function getRights(user: AuthUser) {
  return rights[user.role?.type ?? ""] ?? { manageAllContacts: false };
}

// Prüft, ob der Benutzer einen Kontakt bearbeiten und löschen darf.
// Dieselbe Regel steht in Strapi. Hier entscheidet sie nur, welche Knöpfe man sieht.
export function canManage(user: AuthUser | null | undefined, contact: Contact) {
  if (!user) return false;
  // Rollen wie Admin dürfen alle Kontakte verwalten.
  if (getRights(user).manageAllContacts) return true;
  // Alle anderen nur ihre eigenen.
  return contact.ownerId === user.id;
}
