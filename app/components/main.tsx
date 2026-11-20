"use client";
// Importiert die Funktionen zum Laden und Löschen von Kontakten.
import {
  useContacts,
  useDeleteContact,
  useOwnContacts,
} from "@/app/hooks/general/use-contacts";
// Importiert die Datenstruktur der Kontakte.
import { type Contact } from "@/lib/contact-zod-schema";
// Importiert die einzelnen Bestandteile der Kontaktverwaltung.
import ContactTable from "./contacttable";
import DeletePopup from "./pop-up/delete";
import ContactForm from "./contactform";
import AllContactsPopup from "./pop-up/all-contacts";
// Importiert die Funktion zum Merken von Zuständen.
import { useState } from "react";
// Prüft, ob jemand angemeldet ist.
import { useGetUser } from "../hooks/auth/use-get-user";
// Sortiert eigene Kontakte nach oben.
import { splitOwnFirst } from "@/lib/sort-contacts";
// Hinweis für Gäste, wird anstelle des Formulars angezeigt.
import GuestHint from "./guest-hint";

// Hauptbereich: Zeigt das Formular und verwaltet alle gespeicherten Kontakte.
// Bearbeiten passiert im Profil-Pop-up, das die Tabelle selbst öffnet.
export default function Main() {
  // Prüft, ob jemand angemeldet ist.
  const { data: user } = useGetUser();
  // Lädt alle Kontakte und stellt die Funktion zum Löschen bereit.
  // Lädt die neuesten Kontakte samt Gesamtzahl.
  const { data: result, isLoading, isError } = useContacts();
  const contacts = result?.data;
  const total = result?.meta.pagination.total ?? 0;
  // Eigene Kontakte extra laden, damit sie auch erscheinen, wenn sie älter sind.
  const { data: own } = useOwnContacts(user?.id);
  const ownContacts = own?.data ?? [];
  // STARTSEITE: zuerst die eigenen, dann mit den neuesten fremden auf 4 auffüllen.
  const others = (contacts ?? []).filter(
    (contact) => contact.ownerId !== user?.id,
  );
  const shownContacts = [...ownContacts, ...others].slice(0, 4);
  const { mutate: deleteContact, isPending: isDeleting } = useDeleteContact();

  // Speichert, welcher Kontakt gelöscht wird und ob alle Kontakte offen sind.
  const [deleteContactData, setDeleteContactData] = useState<Contact | null>(
    null,
  );
  const [showAll, setShowAll] = useState(false);

  // Kontakte nur anzeigen, wenn sie fertig geladen sind.
  const showContacts = !isLoading && !isError;

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
      <div className="mx-auto mt-[5vh] flex w-full max-w-360 flex-col items-center gap-8 xl:flex-row xl:items-start xl:justify-center">
        {/* Angemeldet: Formular. Gast: Hinweis mit Login und Registrieren. */}
        {user ? <ContactForm /> : <GuestHint />}

        {/* KONTAKTTABELLE: Zeigt die Einträge aus Strapi an. */}
        <div className="w-full min-w-0 xl:flex-1">
          <div className="cardbox overflow-x-auto">
            <h1 className="headtitle pb-7">
              {user ? "Deine Kontakte" : "Neueste Kontakte"}
            </h1>
            {showContacts && (
              <ContactTable
                // Erst eigene nach oben sortieren, dann die ersten vier nehmen.
                // Zuerst eigene, dann die neuesten fremden.
                contacts={shownContacts}
                isDeleting={isDeleting}
                onDelete={setDeleteContactData}
              />
            )}
          </div>
          {/* Nur angemeldete Benutzer können alle Kontakte öffnen. */}
          {showContacts && user && (
            <div className="mt-3 text-right">
              <button
                type="button"
                onClick={() => setShowAll(true)}
                className="text-blue-700 hover:underline"
              >
                Alle Kontakte anzeigen ({total})
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ALLE KONTAKTE: Fenster mit Suche und Blättern, lädt seine Seiten selbst. */}
      {showAll && (
        <AllContactsPopup
          isDeleting={isDeleting}
          onDelete={setDeleteContactData}
          onClose={() => setShowAll(false)}
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
