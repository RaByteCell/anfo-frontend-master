"use client";
// Importiert die Funktionen zur Verwaltung und Überprüfung der Formulareingaben.
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
// Importiert das X-Symbol zum Schließen des Pop-ups.
import { X } from "lucide-react";
// Importiert die gemeinsamen Eingabefelder des Anmeldeformulars.
import FormFields from "../formfields";
// Importiert die Datenstruktur und Überprüfungsregeln für Kontakte.
import {
  contactSchema,
  type Contact,
  type ContactInput,
} from "@/lib/contact-zod-schema";
// Sperrt das Scrollen der Seite im Hintergrund, solange das Pop-up offen ist.
import { useLockScroll } from "../../hooks/general/use-lock-scroll";
// Legt fest, welche Informationen und Funktionen das Bearbeitungsfenster benötigt.
type EditPopupProps = {
  contact: Contact;
  isUpdating: boolean;
  onSave: (data: ContactInput) => void;
  onClose: () => void;
};
// BEARBEITUNGS-POP-UP: Ermöglicht das Ändern eines bereits gespeicherten Kontakts.
export default function EditPopup({
  contact,
  isUpdating,
  onSave,
  onClose,
}: EditPopupProps) {
  useLockScroll(); // Sperrt das Scrollen im Hintergrund.
  // FORMULAR: Übernimmt die vorhandenen Kontaktdaten und überprüft Änderungen auf ihre Gültigkeit.
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
    // Füllt die Eingabefelder automatisch mit den bisherigen Kontaktdaten aus.
    defaultValues: {
      vorname: contact.vorname,
      nachname: contact.nachname,
      adresse: contact.adresse,
      plz: contact.plz,
      email: contact.email,
      bdate: contact.bdate.slice(0, 10),
    },
  });
  return (
    // Dunkler Hintergrund, der über die gesamte Website gelegt wird.
    <div className="PopUp_Container">
      {/* FENSTERINHALT: Enthält das Bearbeitungsformular und die verfügbaren Aktionen. */}
      <div className="relative mx-auto max-w-sm min-h-[650px] rounded-lg bg-white px-5 pt-13 shadow-xl">
        {/* Schließt das Bearbeitungsfenster, ohne Änderungen zu speichern. */}
        <button
          type="button"
          onClick={onClose}
          className="xButton"
          title="Schließen"
        >
          <X size={22} />
        </button>
        {/* Überschrift des Bearbeitungsfensters. */}
        <h2 className="mb-6 text-center text-2xl font-bold">
          Kontakt bearbeiten
        </h2>
        {/* FORMULAR: Überprüft die Eingaben und übergibt die Änderungen zum Speichern. */}
        <form
          noValidate
          onSubmit={handleSubmit(onSave)}
          className="grid grid-cols-1 gap-6 px-5"
        >
          {/* Zeigt die vorausgefüllten Eingabefelder und mögliche Fehlermeldungen an. */}
          <FormFields register={register} errors={errors} />
          {/* AKTIONEN: Bietet die Möglichkeit, Änderungen abzubrechen oder zu speichern. */}
          <div className="PopUp_ActionButton">
            {/* Bricht die Bearbeitung ab und schließt das Fenster. */}
            <button
              type="button"
              onClick={onClose}
              className="rounded-md bg-gray-300 px-4 py-2 hover:bg-gray-400"
            >
              Abbrechen
            </button>
            {/* Speichert die Änderungen und zeigt währenddessen einen Ladehinweis an. */}
            <button
              type="submit"
              disabled={isUpdating}
              className="rounded-md bg-blue-400 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {isUpdating ? "Speichert..." : "Speichern"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
