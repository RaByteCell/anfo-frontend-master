"use client";
// Importiert die Funktionen zum Laden, Erstellen, Bearbeiten und Löschen von Kontakten.
import {
  useContacts,
  useCreateContact,
  useUpdateContact,
  useDeleteContact,
} from "@/lib/contacts";
// Importiert die Datenstruktur und Regeln zur Überprüfung der Formulareingaben.
import {
  contactSchema,
  type Contact,
  type ContactInput,
} from "@/lib/contact-zod-schema";
// Importiert die einzelnen Bestandteile der Kontaktverwaltung.
import ContactTable from "./contacttable";
import DeletePopup from "./pop-up/delete";
import FormFields from "./formfields";
import EditPopup from "./pop-up/edit";
// Importiert React und die Funktionen zur Verwaltung der Formulareingaben.
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

// Hauptkomponente: Verwaltet das Anmeldeformular und alle gespeicherten Kontakte.
export default function ContactForm() {
  // Lädt alle Kontakte und stellt die Funktionen zum Erstellen, Bearbeiten und Löschen bereit.
  const { data: contacts, isLoading, isError } = useContacts();
  const { mutate, isSuccess } = useCreateContact();
  const { mutate: deleteContact, isPending: isDeleting } = useDeleteContact();
  const { mutate: updateContact, isPending: isUpdating } = useUpdateContact();
  // Speichert, welcher Kontakt gerade bearbeitet oder gelöscht werden soll.
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [deleteContactData, setDeleteContactData] = useState<Contact | null>(
    null,
  );
  // Verbindet die Formulareingaben mit der automatischen Überprüfung der Daten.
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ContactInput>({ resolver: zodResolver(contactSchema) });
  // ERSTELLEN: Speichert einen neu ausgefüllten Kontakt.
  const onSubmit = (data: ContactInput) => mutate(data);
  // BEARBEITEN: Speichert die Änderungen des ausgewählten Kontakts.
  const onUpdate = (data: ContactInput) => {
    if (!selectedContact) return;
    updateContact(
      { documentId: selectedContact.documentId, data },
      { onSuccess: () => setSelectedContact(null) },
    );
  };
  // LÖSCHEN: Entfernt den ausgewählten Kontakt nach der Bestätigung.
  const onDelete = () => {
    if (!deleteContactData) return;
    deleteContact(deleteContactData.documentId, {
      onSuccess: () => setDeleteContactData(null),
    });
  };
  return (
    <main className="flex flex-1 flex-col items-center gap-8">
      {/* ANMELDEFORMULAR: Hier können neue Kontakte eingetragen und gespeichert werden. */}
      <div className="containersec mx-auto flex max-w-sm items-center bg-white px-6 py-8 ring shadow-xl ring-gray-900/5">
        <form
          className="ml-5 grid grid-cols-1 gap-y-5"
          onSubmit={handleSubmit(onSubmit)}
        >
          <h1 className="text-center text-3xl font-bold">Anmeldeformular</h1>
          {/* Zeigt alle Eingabefelder und mögliche Fehlermeldungen an. */}
          <FormFields register={register} errors={errors} />
          <button
            type="submit"
            className="buttonsec mx-auto rounded-md bg-blue-400 p-2 text-center text-white hover:bg-gray-700"
          >
            Absenden
          </button>
          {/* Zeigt eine Erfolgsmeldung an, sobald ein Kontakt gespeichert wurde. */}
          {isSuccess && (
            <p className="text-green-600">
              Benutzer wurde erfolgreich gespeichert!
            </p>
          )}
        </form>
      </div>

      {/* KONTAKTTABELLE: Zeigt alle gespeicherten Einträge aus Strapi an. */}
      <div className="w-full max-w-5xl overflow-x-auto bg-white p-6 shadow-xl">
        <h2 className="mb-5 text-center text-2xl font-bold">
          Gespeicherte Anmeldungen
        </h2>
        {!isLoading && !isError && (
          <ContactTable
            contacts={contacts ?? []}
            isDeleting={isDeleting}
            onEdit={setSelectedContact}
            onDelete={setDeleteContactData}
          />
        )}
      </div>

      {/* BEARBEITUNGSFENSTER: Öffnet ein Fenster zum Ändern des ausgewählten Kontakts. */}
      {selectedContact && (
        <EditPopup
          contact={selectedContact}
          isUpdating={isUpdating}
          onSave={onUpdate}
          onClose={() => setSelectedContact(null)}
        />
      )}

      {/* LÖSCHFENSTER: Fragt nach einer Bestätigung, bevor ein Kontakt gelöscht wird. */}
      {deleteContactData && (
        <DeletePopup
          contact={deleteContactData}
          isDeleting={isDeleting}
          onConfirm={onDelete}
          onClose={() => setDeleteContactData(null)}
        />
      )}
    </main>
  );
}
