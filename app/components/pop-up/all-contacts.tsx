// Dieser Code läuft im Browser, weil er auf Klicks reagiert.
"use client";
// useState: Suche, Seite und Filter. useRef: Scrollbereich. useEffect: Seite korrigieren.
import { useEffect, useRef, useState } from "react";
// Symbole: Schließen, Blättern und Filter.
import { X, ChevronLeft, ChevronRight, SlidersHorizontal } from "lucide-react";
// Die Tabelle mit den Kontakten.
import ContactTable from "../contacttable";
// Das Fenster zum Einstellen der Filter.
import FilterPopup from "./filter";
// Bauplan eines gespeicherten Kontakts.
import type { Contact } from "@/lib/contact-zod-schema";
// Lädt eine Seite Kontakte von Strapi, dazu alles rund um die Filter.
import {
  useContactsPage,
  EMPTY_FILTERS,
  countActiveFilters,
  type ContactFilters,
} from "@/app/hooks/general/use-contacts";
// Prüft, wer angemeldet ist, damit dessen Kontakte zuerst kommen.
import { useGetUser } from "../../hooks/auth/use-get-user";
// Sperrt das Scrollen der Seite im Hintergrund, solange das Pop-up offen ist.
import { useLockScroll } from "../../hooks/general/use-lock-scroll";

// Legt fest, was das Pop-up von außen bekommen muss.
type AllContactsPopupProps = {
  isDeleting: boolean; // Wird gerade ein Kontakt gelöscht?
  onDelete: (contact: Contact) => void; // Wird beim Löschen eines Kontakts ausgeführt.
  onClose: () => void; // Wird beim Schließen des Pop-ups ausgeführt.
};

// Monatsnamen für die Anzeige der aktiven Filter.
const MONTHS = [
  "Jänner",
  "Februar",
  "März",
  "April",
  "Mai",
  "Juni",
  "Juli",
  "August",
  "September",
  "Oktober",
  "November",
  "Dezember",
];

// Beschreibt die gesetzten Filter in kurzen Worten, z. B. "Geboren März 1990".
function describeFilters(filters: ContactFilters) {
  const parts: string[] = [];
  if (filters.year) {
    if (filters.day) {
      parts.push(
        `Geboren am ${filters.day}. ${MONTHS[Number(filters.month) - 1]} ${filters.year}`,
      );
    } else if (filters.month) {
      parts.push(
        `Geboren ${MONTHS[Number(filters.month) - 1]} ${filters.year}`,
      );
    } else {
      parts.push(`Geburtsjahr ${filters.year}`);
    }
  }
  if (filters.plz) parts.push(`PLZ ${filters.plz}…`);
  if (filters.picture === "with") parts.push("mit Profilbild");
  if (filters.picture === "without") parts.push("ohne Profilbild");
  return parts;
}

// Pop-up, das alle Kontakte seitenweise anzeigt, mit Suche und Filtern.
export default function AllContactsPopup({
  isDeleting,
  onDelete,
  onClose,
}: AllContactsPopupProps) {
  useLockScroll(); // Sperrt das Scrollen im Hintergrund.
  const { data: user } = useGetUser();
  const [search, setSearch] = useState(""); // Suchbegriff (am Anfang leer).
  const [page, setPage] = useState(1); // Aktuelle Seite (am Anfang Seite 1).
  const [filters, setFilters] = useState<ContactFilters>(EMPTY_FILTERS); // Gesetzte Filter.
  const [showFilter, setShowFilter] = useState(false); // Ist das Filter-Fenster offen?
  // Lädt die aktuelle Seite: eigene Kontakte zuerst, mit Suche und Filtern.
  const { data, isLoading } = useContactsPage(
    page,
    search.trim(),
    user?.id,
    filters,
  );
  const contacts = data?.data ?? [];
  const pagination = data?.meta.pagination;
  const pageCount = pagination?.pageCount ?? 1;
  const activeFilters = countActiveFilters(filters);
  // Der Scrollbereich der Tabelle, damit beim Blättern wieder oben begonnen wird.
  const listRef = useRef<HTMLDivElement>(null);

  // Wurde der letzte Kontakt der letzten Seite gelöscht: eine Seite zurück.
  useEffect(() => {
    if (pagination && pagination.pageCount > 0 && page > pagination.pageCount) {
      setPage(pagination.pageCount);
    }
  }, [pagination, page]);

  // BLÄTTERN: Seite wechseln und die Liste wieder nach oben scrollen.
  const goTo = (newPage: number) => {
    setPage(newPage);
    listRef.current?.scrollTo({ top: 0 });
  };

  // FILTER ÜBERNEHMEN: neue Filter setzen und wieder bei Seite 1 beginnen.
  const applyFilters = (newFilters: ContactFilters) => {
    setFilters(newFilters);
    setShowFilter(false);
    goTo(1);
  };

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

        {/* SUCHE UND FILTER nebeneinander */}
        <div className="mb-2 flex gap-2">
          {/* Suchfeld: Bei jeder Eingabe beginnt die Liste wieder bei Seite 1. */}
          <input
            type="search"
            autoFocus
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Suchen (Name, Adresse, PLZ, E-Mail)..."
            className="min-w-0 flex-1 rounded-md border border-blue-400 px-3 py-2"
          />
          {/* Filter-Knopf: zeigt die Anzahl gesetzter Filter. */}
          <button
            type="button"
            onClick={() => setShowFilter(true)}
            className={`buttonsec inline-flex shrink-0 items-center gap-2 rounded-md border px-4 py-2 ${
              activeFilters > 0
                ? "border-blue-400 bg-blue-400 text-white hover:bg-gray-700"
                : "border-blue-400 text-blue-400 hover:bg-blue-50"
            }`}
          >
            <SlidersHorizontal size={18} />
            Filter
            {activeFilters > 0 && (
              <span className="rounded-full bg-white px-2 text-sm font-semibold text-blue-500">
                {activeFilters}
              </span>
            )}
          </button>
        </div>

        {/* INFO: welche Filter gerade gelten, mit Zurücksetzen. */}
        {activeFilters > 0 && (
          <div className="mb-2 flex flex-wrap items-center gap-2 text-sm">
            <span className="text-gray-500">Filter aktiv:</span>
            {describeFilters(filters).map((text) => (
              <span
                key={text}
                className="rounded-full bg-blue-50 px-3 py-1 text-blue-700"
              >
                {text}
              </span>
            ))}
            <button
              type="button"
              onClick={() => applyFilters(EMPTY_FILTERS)}
              className="buttonsec text-blue-400 hover:underline"
            >
              Zurücksetzen
            </button>
          </div>
        )}

        {/* Wie viele Kontakte zu Suche und Filtern passen. */}
        <p className="mb-3 text-sm text-gray-500">
          {pagination?.total ?? 0} Kontakte
        </p>

        {/* Tabelle mit fester Höhe, ist sie länger, kann man darin scrollen. */}
        <div ref={listRef} className="h-[60vh] overflow-auto">
          {!isLoading && (
            <ContactTable
              contacts={contacts}
              isDeleting={isDeleting}
              onDelete={onDelete}
            />
          )}
          {/* BLÄTTERN: am Ende der Liste. Links Zurück, Mitte Seitenzahl, rechts Weiter. */}
          {pageCount > 1 && (
            <div className="mt-6 mb-2 grid grid-cols-3 items-center px-2">
              <div>
                {page > 1 && (
                  <button
                    type="button"
                    onClick={() => goTo(page - 1)}
                    className="buttonsec inline-flex items-center gap-1 rounded-md border border-blue-400 px-4 py-2 text-blue-400 hover:bg-blue-50"
                  >
                    <ChevronLeft size={18} />
                    Zurück
                  </button>
                )}
              </div>
              <p className="text-center text-sm text-gray-500">
                Seite {page} von {pageCount}
              </p>
              <div className="text-right">
                {page < pageCount && (
                  <button
                    type="button"
                    onClick={() => goTo(page + 1)}
                    className="buttonsec inline-flex items-center gap-1 rounded-md border border-blue-400 px-4 py-2 text-blue-400 hover:bg-blue-50"
                  >
                    Weiter
                    <ChevronRight size={18} />
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* FILTER-FENSTER: liegt über der Kontaktliste. */}
      {showFilter && (
        <FilterPopup
          value={filters}
          onApply={applyFilters}
          onClose={() => setShowFilter(false)}
        />
      )}
    </div>
  );
}
