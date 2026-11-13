// Dieser Code läuft im Browser, weil er auf Klicks reagiert.
"use client";
// Damit kann sich die Seite Zustände merken, z. B. ob etwas geöffnet ist.
import { useState } from "react";
// X-Symbol zum Schließen des Pop-ups.
import { X } from "lucide-react";
// Die Tabelle mit den Kontakten.
import ContactTable from "../contacttable";
// Zeigt Datumsangaben überall im gleichen Format an.
import { formatDate } from "@/lib/format-date";
// Bauplan eines gespeicherten Kontakts.
import type { Contact } from "@/lib/contact-zod-schema";
// Sperrt das Scrollen der Seite im Hintergrund, solange das Pop-up offen ist.
import { useLockScroll } from "../../hooks/general/use-lock-scroll";
// Legt fest, was das Pop-up von außen bekommen muss.
type AllContactsPopupProps = {
  contacts: Contact[]; // Liste aller Kontakte
  isDeleting: boolean; // Wird gerade ein Kontakt gelöscht?
  onEdit: (contact: Contact) => void; // Wird beim Bearbeiten eines Kontakts ausgeführt.
  onDelete: (contact: Contact) => void; // Wird beim Löschen eines Kontakts ausgeführt.
  onClose: () => void; // Wird beim Schließen des Pop-ups ausgeführt.
};
// Pop-up, das alle Kontakte anzeigt.
export default function AllContactsPopup({
  contacts,
  isDeleting,
  onEdit,
  onDelete,
  onClose,
}: AllContactsPopupProps) {
  useLockScroll(); // Sperrt das Scrollen im Hintergrund.
  const [search, setSearch] = useState(""); // Merkt sich den Suchbegriff (am Anfang leer).
  // Suchtext aufbereiten und alle Kontakte filtern
  const query = search.trim().toLowerCase();
  const filtered = contacts.filter((contact) =>
    [
      contact.vorname,
      contact.nachname,
      contact.adresse,
      contact.plz,
      contact.email,
      formatDate(contact.bdate),
    ]
      .join(" ")
      .toLowerCase()
      .includes(query),
  );
  return (
    // Abgedunkelter Hintergrund des Pop-ups.
    <div className="PopUp_Container">
      {/* Das weiße Fenster in der Mitte */}
      <div className="relative w-full max-w-5xl rounded-lg bg-white p-6 shadow-xl">
        {/* X-Knopf zum Schließen */}
        <button
          type="button"
          onClick={onClose}
          className="xButton"
          title="Schließen"
        >
          <X size={22} />
        </button>
        <h2 className="mb-4 text-center text-2xl font-bold">Alle Kontakte</h2>
        {/* Suchfeld: Der Cursor steht sofort darin, jede Eingabe wird als Suchbegriff gespeichert. */}
        <input
          type="search"
          autoFocus
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Suchen (Name, Adresse, PLZ, E-Mail, Datum)..."
          className="mb-2 w-full rounded-md border border-blue-400 px-3 py-2"
        />
        {/* Zeigt, wie viele Kontakte zur Suche passen. */}
        <p className="mb-3 text-sm text-gray-500">
          {filtered.length} von {contacts.length} Kontakten
        </p>
        {/* Tabelle mit fester Höhe, ist sie länger, kann man darin scrollen. */}
        <div className="h-[60vh] overflow-auto">
          {/* Zeigt nur die Kontakte, die zur Suche passen. */}
          <ContactTable
            contacts={filtered}
            isDeleting={isDeleting}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        </div>
      </div>
    </div>
  );
}
