"use client";
// Erlaubt in dieser Datei das normale img statt des Next.js-Bildbausteins.
/* eslint-disable @next/next/no-img-element */
// Symbole zum Bearbeiten und Löschen.
import { Pencil, Trash2 } from "lucide-react";
// Fragment: fasst Elemente zusammen. useState: merkt sich, welches Profil offen ist.
import { Fragment, useState } from "react";
// Einheitliche Darstellung von Datumsangaben.
import { formatDate } from "@/lib/format-date";
// Datenstruktur eines Kontakts.
import type { Contact } from "@/lib/contact-zod-schema";
// Prüft, ob jemand angemeldet ist.
import { useGetUser } from "../hooks/auth/use-get-user";
// Prüft, ob jemand einen Kontakt verwalten darf.
import { canManage } from "@/lib/permissions";
// Sortiert eigene Kontakte nach oben.
import { splitOwnFirst } from "@/lib/sort-contacts";
// Adresse des Profilbilds.
import { getPictureUrl } from "@/lib/pictureurl";
// Pop-up zum Ansehen und Bearbeiten eines Kontakts.
import ProfilePopup from "./pop-up/profile";

// Legt fest, welche Daten und Funktionen die Tabelle von außen erhält.
type ContactTableProps = {
  contacts: Contact[];
  isDeleting: boolean;
  onDelete: (contact: Contact) => void;
};

// Legt die Überschriften der einzelnen Tabellenspalten fest.
const headings = [
  "Profilbild",
  "Vorname",
  "Nachname",
  "Adresse",
  "PLZ",
  "E-Mail",
  "Geburtsdatum",
  "Verwalten",
];
// Feste Breiten für Spalten mit gleich langem Inhalt. Die übrigen teilen sich den Rest.
const columnWidths: Record<string, string> = {
  Profilbild: "w-24",
  PLZ: "w-20",
  Geburtsdatum: "w-32",
  Verwalten: "w-24",
};
// Hauptkomponente: Zeigt alle gespeicherten Kontakte in einer Tabelle an.
export default function ContactTable({
  contacts,
  isDeleting,
  onDelete,
}: ContactTableProps) {
  const { data: user } = useGetUser();
  const loggedIn = Boolean(user);
  // Merkt sich, welches Profil offen ist und ob direkt bearbeitet wird.
  const [profile, setProfile] = useState<{
    contact: Contact;
    editing: boolean;
  } | null>(null);
  // Gäste sehen persönliche Daten nur verschwommen.
  const privateClass = loggedIn ? "" : "blur-sm select-none";
  const privateTitle = loggedIn ? undefined : "Nur nach dem Login sichtbar";
  // Spalte "Verwalten" nur für angemeldete Benutzer.
  const visibleHeadings = loggedIn
    ? headings
    : headings.filter((heading) => heading !== "Verwalten");
  // EIGENE ZUERST: Eigene Kontakte alphabetisch oben, danach alle anderen.
  const { mine, sortedContacts } = splitOwnFirst(contacts, user?.id);

  // TEXTZELLE: kürzt zu lange Werte mit "…" ab. Der ganze Wert erscheint beim Darüberfahren.
  // Bei Gästen zeigt der Hinweis nur "Nur nach dem Login sichtbar", damit nichts verraten wird.
  const cell = (value: string, isPrivate = false) => (
    <td
      className="contactview"
      title={isPrivate && !loggedIn ? privateTitle : value}
    >
      <span className={`block truncate ${isPrivate ? privateClass : ""}`}>
        {value}
      </span>
    </td>
  );

  return (
    <>
      {/* table-fixed: Breiten richten sich nach der Box, nicht nach dem Inhalt. */}
      <table className="w-full table-fixed border-collapse text-left">
        {/* SPALTENBREITEN: feste Breite, wo eine angegeben ist, sonst gleich viel vom Rest. */}
        <colgroup>
          {visibleHeadings.map((heading) => (
            <col key={heading} className={columnWidths[heading]} />
          ))}
        </colgroup>
        {/* TABELLENKOPF: Zeigt die Überschriften der einzelnen Spalten an. */}
        <thead>
          <tr className="bg-gray-700 text-center text-blue-50">
            {visibleHeadings.map((heading) => (
              <th key={heading} className="contactview">
                {heading}
              </th>
            ))}
          </tr>
        </thead>
        {/* TABELLENINHALT: Zeigt die gespeicherten Kontaktdaten zeilenweise an. */}
        <tbody>
          {sortedContacts.map((contact, index) => (
            <Fragment key={contact.id}>
              {/* TRENNLINIE: Vor dem ersten fremden Kontakt, wenn es eigene gibt. */}
              {index === mine.length && mine.length > 0 && (
                <tr>
                  <td colSpan={visibleHeadings.length} className="py-3">
                    <div className="flex items-center gap-3 text-sm font-semibold text-gray-500">
                      <span className="h-px flex-1 bg-gray-300" />
                      Weitere Kontakte
                      <span className="h-px flex-1 bg-gray-300" />
                    </div>
                  </td>
                </tr>
              )}
              {/* Eigene Kontakte haben einen zarten blauen Hintergrund. */}
              <tr
                className={
                  contact.ownerId === user?.id
                    ? "bg-blue-50 hover:bg-blue-100"
                    : "hover:bg-gray-100"
                }
              >
                {/* PROFILBILD: Angemeldete öffnen per Klick das Profil, Gäste sehen nur das Bild. */}
                <td className="contactview">
                  {loggedIn ? (
                    <button
                      type="button"
                      onClick={() => setProfile({ contact, editing: false })}
                      className="buttonsec rounded-full transition hover:ring-4 hover:ring-blue-200"
                      title="Profil anzeigen"
                    >
                      <img
                        src={getPictureUrl(contact)}
                        alt={`Profilbild von ${contact.vorname} ${contact.nachname}`}
                        className="h-16 w-16 rounded-full object-cover"
                      />
                    </button>
                  ) : (
                    <img
                      src={getPictureUrl(contact)}
                      alt={`Profilbild von ${contact.vorname} ${contact.nachname}`}
                      className="mx-auto h-16 w-16 rounded-full object-cover"
                    />
                  )}
                </td>
                {/* DATEN: Adresse, PLZ, E-Mail und Geburtsdatum sind für Gäste verschwommen. */}
                {cell(contact.vorname)}
                {cell(contact.nachname)}
                {cell(contact.adresse, true)}
                {cell(contact.plz, true)}
                {cell(contact.email, true)}
                {cell(formatDate(contact.bdate), true)}
                {/* VERWALTUNG: Knöpfe nur bei Kontakten, die man verwalten darf. */}
                {loggedIn && (
                  <td className="contactview">
                    {canManage(user, contact) ? (
                      <div className="flex justify-center gap-3">
                        {/* Öffnet das Profil direkt im Bearbeiten-Modus. */}
                        <button
                          type="button"
                          onClick={() => setProfile({ contact, editing: true })}
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
                    ) : (
                      // Fremder Kontakt: nur ein Strich statt der Knöpfe.
                      <span className="text-gray-400">–</span>
                    )}
                  </td>
                )}
              </tr>
            </Fragment>
          ))}
          {/* LEERE TABELLE: Zeigt einen Hinweis an, wenn keine Kontakte vorhanden sind. */}
          {contacts.length === 0 && (
            <tr>
              <td
                colSpan={visibleHeadings.length}
                className="border p-4 text-center"
              >
                Keine Kontakte vorhanden.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* PROFIL: Öffnet sich nach Klick auf ein Bild oder den Stift. */}
      {profile && (
        <ProfilePopup
          contact={profile.contact}
          startEditing={profile.editing}
          onClose={() => setProfile(null)}
        />
      )}
    </>
  );
}
