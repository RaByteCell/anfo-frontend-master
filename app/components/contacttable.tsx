// Importiert die Symbole zum Bearbeiten und Löschen von Kontakten.
import { Pencil, Trash2 } from "lucide-react";
// Importiert die Funktion zur einheitlichen Darstellung von Datumsangaben.
import { formatDate } from "@/lib/format-date";
// Importiert die Datenstruktur eines Kontakts.
import type { Contact } from "@/lib/contact-zod-schema";
// Legt fest, welche Daten und Funktionen die Tabelle von außen erhält.
type ContactTableProps = {
  contacts: Contact[];
  isDeleting: boolean;
  onEdit: (contact: Contact) => void;
  onDelete: (contact: Contact) => void;
};
// Legt die Überschriften der einzelnen Tabellenspalten fest.
const headings = [
  "Vorname",
  "Nachname",
  "Adresse",
  "PLZ",
  "E-Mail",
  "Geburtsdatum",
  "Verwalten",
];
// Hauptkomponente: Zeigt alle gespeicherten Kontakte in einer Tabelle an.
export default function ContactTable({
  contacts,
  isDeleting,
  onEdit,
  onDelete,
}: ContactTableProps) {
  return (
    <table className="w-full border-collapse text-left">
      {/* TABELLENKOPF: Zeigt die Überschriften der einzelnen Spalten an. */}
      <thead>
        <tr className="bg-gray-700 text-blue-50 text-center">
          {headings.map((heading) => (
            <th key={heading} className="contactview">
              {heading}
            </th>
          ))}
        </tr>
      </thead>
      {/* TABELLENINHALT: Zeigt die gespeicherten Kontaktdaten zeilenweise an. */}
      <tbody>
        {contacts.map((contact) => (
          <tr key={contact.id} className="hover:bg-gray-100">
            <td className="contactview">{contact.vorname}</td>
            <td className="contactview">{contact.nachname}</td>
            <td className="contactview">{contact.adresse}</td>
            <td className="contactview">{contact.plz}</td>
            <td className="contactview">{contact.email}</td>
            <td className="contactview">{formatDate(contact.bdate)}</td>
            {/* VERWALTUNG: Bietet für jeden Kontakt eine Bearbeitungs- und Löschfunktion. */}
            <td className="contactview">
              <div className="flex justify-center gap-3">
                {/* Öffnet die Bearbeitung des ausgewählten Kontakts. */}
                <button
                  type="button"
                  onClick={() => onEdit(contact)}
                  className="text-blue-400 hover:text-blue-800"
                  title="Bearbeiten"
                >
                  <Pencil size={18} />
                </button>
                {/* Startet den Löschvorgang für den ausgewählten Kontakt. */}
                <button
                  type="button"
                  disabled={isDeleting}
                  onClick={() => onDelete(contact)}
                  className="text-red-600 hover:text-red-800 disabled:opacity-40"
                  title="Löschen"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </td>
          </tr>
        ))}
        {/* LEERE TABELLE: Zeigt einen Hinweis an, wenn keine Kontakte vorhanden sind. */}
        {contacts.length === 0 && (
          <tr>
            <td colSpan={7} className="border p-4 text-center">
              Keine Anmeldungen vorhanden.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}
