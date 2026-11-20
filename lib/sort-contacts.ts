import type { Contact } from "./contact-zod-schema";

// Sortiert alphabetisch nach Nachname, bei gleichem Nachnamen nach Vorname.
const byName = (a: Contact, b: Contact) =>
  a.nachname.localeCompare(b.nachname, "de") ||
  a.vorname.localeCompare(b.vorname, "de");

// EIGENE ZUERST: Eigene Kontakte alphabetisch oben, danach alle anderen.
export function splitOwnFirst(contacts: Contact[], userId?: number) {
  const mine =
    userId === undefined
      ? []
      : contacts.filter((contact) => contact.ownerId === userId).sort(byName);
  const others = contacts.filter((contact) => !mine.includes(contact));
  return { mine, others, sortedContacts: [...mine, ...others] };
}
