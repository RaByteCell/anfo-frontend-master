import { Pencil, Trash2 } from "lucide-react";
import { formatDate } from "@/lib/format-date";
import type { Contact } from "@/lib/contact-zod-schema";

type ContactTableProps = {
  contacts: Contact[];
  isDeleting: boolean;
  onEdit: (contact: Contact) => void;
  onDelete: (contact: Contact) => void;
};

const headings = [
  "Vorname",
  "Nachname",
  "Adresse",
  "PLZ",
  "E-Mail",
  "Geburtsdatum",
  "Verwalten",
];

export default function ContactTable({
  contacts,
  isDeleting,
  onEdit,
  onDelete,
}: ContactTableProps) {
  return (
    <table className="w-full border-collapse text-left">
      <thead>
        <tr className="bg-gray-700 text-blue-50 text-center">
          {headings.map((heading) => (
            <th key={heading} className="contactview">
              {heading}
            </th>
          ))}
        </tr>
      </thead>

      <tbody>
        {contacts.map((contact) => (
          <tr key={contact.id} className="hover:bg-gray-100">
            <td className="contactview">{contact.vorname}</td>
            <td className="contactview">{contact.nachname}</td>
            <td className="contactview">{contact.adresse}</td>
            <td className="contactview">{contact.plz}</td>
            <td className="contactview">{contact.email}</td>
            <td className="contactview">{formatDate(contact.bdate)}</td>

            <td className="contactview">
              <div className="flex justify-center gap-3">
                <button
                  type="button"
                  onClick={() => onEdit(contact)}
                  className="text-blue-400 hover:text-blue-800"
                  title="Bearbeiten"
                >
                  <Pencil size={18} />
                </button>

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
