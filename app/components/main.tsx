"use client";
// Importiert die Funktionen zum Laden, Bearbeiten und Löschen von Kontakten.
import {
  useContacts,
  useUpdateContact,
  useDeleteContact,
} from "@/lib/contacts";
// Importiert die Datenstruktur der Kontakte.
import { type Contact, type ContactInput } from "@/lib/contact-zod-schema";
// Importiert die einzelnen Bestandteile der Kontaktverwaltung.
import ContactTable from "./contacttable";
import DeletePopup from "./pop-up/delete";
import ContactForm from "./contactform";
import EditPopup from "./pop-up/edit";
import AllContactsPopup from "./pop-up/all-contacts";
// Importiert die Funktion zum Merken von Zuständen.
import { useState } from "react";

// Hauptkomponente: Zeigt das Anmeldeformular und verwaltet alle gespeicherten Kontakte.
export default function Main() {
  // Lädt alle Kontakte und stellt die Funktionen zum Bearbeiten und Löschen bereit.
  const { data: contacts, isLoading, isError } = useContacts();
  const { mutate: deleteContact, isPending: isDeleting } = useDeleteContact();
  const { mutate: updateContact, isPending: isUpdating } = useUpdateContact();

  // Speichert, welcher Kontakt bearbeitet oder gelöscht wird und ob alle Kontakte offen sind.
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [deleteContactData, setDeleteContactData] = useState<Contact | null>(
    null,
  );
  const [showAll, setShowAll] = useState(false);

  // Kontakte nur anzeigen, wenn sie fertig geladen sind.
  const showContacts = !isLoading && !isError;

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
    <main className="flex-1 px-4">
      {/* RAHMEN: untereinander auf kleinen, nebeneinander auf großen Bildschirmen */}
      <div className="mx-auto mt-[5vh] flex w-full max-w-[90rem] flex-col items-center gap-8 xl:flex-row xl:items-start xl:justify-center">
        <ContactForm />

        {/* KONTAKTTABELLE: Zeigt die neuesten Einträge aus Strapi an. */}
        <div className="w-full min-w-0 xl:flex-1">
          <div className="cardbox overflow-x-auto">
            <h1 className="headtitle pb-7">Neueste Kontakte</h1>
            {showContacts && (
              <ContactTable
                contacts={(contacts ?? []).slice(0, 4)}
                isDeleting={isDeleting}
                onEdit={setSelectedContact}
                onDelete={setDeleteContactData}
              />
            )}
          </div>
          {showContacts && (
            <div className="mt-3 text-right">
              <button
                type="button"
                onClick={() => setShowAll(true)}
                className="text-blue-400 hover:underline"
              >
                Alle Kontakte anzeigen ({contacts?.length ?? 0})
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ALLE KONTAKTE: Öffnet ein Fenster mit der vollständigen Kontaktliste. */}
      {showAll && contacts && (
        <AllContactsPopup
          contacts={contacts}
          isDeleting={isDeleting}
          onEdit={setSelectedContact}
          onDelete={setDeleteContactData}
          onClose={() => setShowAll(false)}
        />
      )}

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
