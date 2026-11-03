import { X } from "lucide-react";
import type { Contact } from "@/lib/contact-zod-schema";

type DeletePopupProps = {
  contact: Contact;
  isDeleting: boolean;
  onConfirm: () => void;
  onClose: () => void;
};

export default function DeletePopup({
  contact,
  isDeleting,
  onConfirm,
  onClose,
}: DeletePopupProps) {
  return (
    <div className="PopUp_Container">
      <div className="relative w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
        <button
          type="button"
          disabled={isDeleting}
          onClick={onClose}
          className="xButton"
          title="Schließen"
        >
          <X size={22} />
        </button>

        <h2 className="mb-4 text-center text-2xl font-bold">
          Eintrag löschen?
        </h2>

        <p className="mb-3 text-center text-gray-600">
          Soll der Kontakt wirklich gelöscht werden?
        </p>

        <p className="mb-6 text-center text-lg font-semibold">
          {contact.vorname} {contact.nachname}
        </p>

        <div className="PopUp_ActionButton">
          <button
            type="button"
            disabled={isDeleting}
            onClick={onClose}
            className="rounded-md bg-gray-300 px-4 py-2 hover:bg-gray-400 disabled:opacity-50"
          >
            Abbrechen
          </button>

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
