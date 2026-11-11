// Importiert das X-Symbol zum Schließen des Pop-ups.
import { X } from "lucide-react";
// Importiert die Datenstruktur eines gespeicherten Kontakts.
import type { Contact } from "@/lib/contact-zod-schema";
// Sperrt das Scrollen der Seite im Hintergrund, solange das Pop-up offen ist.
import { useLockScroll } from "../../hooks/auth/use-lock-scroll";
// Legt fest, welche Informationen und Funktionen das Löschfenster benötigt.
type DeletePopupProps = {
  contact: Contact;
  isDeleting: boolean;
  onConfirm: () => void;
  onClose: () => void;
};
// LÖSCH-POP-UP: Zeigt eine Sicherheitsabfrage an, bevor ein Kontakt gelöscht wird.
export default function DeletePopup({
  contact,
  isDeleting,
  onConfirm,
  onClose,
}: DeletePopupProps) {
  useLockScroll(); // Sperrt das Scrollen im Hintergrund.
  return (
    // Dunkler Hintergrund, der über die gesamte Website gelegt wird.
    <div className="PopUp_Container">
      {/* FENSTERINHALT: Zeigt die Löschabfrage und die verfügbaren Aktionen an. */}
      <div className="relative w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
        {/* Schließt das Pop-up, ohne den Kontakt zu löschen. */}
        <button
          type="button"
          disabled={isDeleting}
          onClick={onClose}
          className="xButton"
          title="Schließen"
        >
          <X size={22} />
        </button>
        {/* Überschrift der Sicherheitsabfrage. */}
        <h2 className="mb-4 text-center text-2xl font-bold">
          Eintrag löschen?
        </h2>
        {/* Fragt den Benutzer, ob der ausgewählte Kontakt wirklich gelöscht werden soll. */}
        <p className="mb-3 text-center text-gray-600">
          Soll der Kontakt wirklich gelöscht werden?
        </p>
        {/* Zeigt den Vor- und Nachnamen des Kontakts an, der gelöscht werden soll. */}
        <p className="mb-6 text-center text-lg font-semibold">
          {contact.vorname} {contact.nachname}
        </p>
        {/* AKTIONEN: Bietet die Möglichkeit, den Vorgang abzubrechen oder zu bestätigen. */}
        <div className="PopUp_ActionButton">
          {/* Bricht den Löschvorgang ab und schließt das Fenster. */}
          <button
            type="button"
            disabled={isDeleting}
            onClick={onClose}
            className="rounded-md bg-gray-300 px-4 py-2 hover:bg-gray-400 disabled:opacity-50"
          >
            Abbrechen
          </button>
          {/* Bestätigt das Löschen und zeigt währenddessen einen Ladehinweis an. */}
          <button
            type="button"
            disabled={isDeleting}
            onClick={onConfirm}
            className="rounded-md bg-red-600 px-4 py-2 text-white hover:bg-red-800 disabled:opacity-50"
          >
            {isDeleting ? "Wird gelöscht..." : "Ja, löschen"}
          </button>
        </div>
      </div>
    </div>
  );
}
