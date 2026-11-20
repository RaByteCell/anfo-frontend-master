"use client";
// useState: merkt sich die Eingaben, bis "Anwenden" gedrückt wird.
import { useState } from "react";
// X-Symbol zum Schließen des Pop-ups.
import { X } from "lucide-react";
// Filter-Typ, leere Filter und der Zeitraum fürs Geburtsdatum.
import {
  EMPTY_FILTERS,
  type ContactFilters,
} from "@/app/hooks/general/use-contacts";
// Sperrt das Scrollen der Seite im Hintergrund, solange das Pop-up offen ist.
import { useLockScroll } from "../../hooks/general/use-lock-scroll";

// Legt fest, was das Filter-Pop-up von außen bekommt.
type FilterPopupProps = {
  value: ContactFilters; // die aktuell gesetzten Filter
  onApply: (filters: ContactFilters) => void; // übernimmt die neuen Filter
  onClose: () => void; // schließt ohne Änderung
};

// Monatsnamen für die Auswahl (österreichisch: Jänner).
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

// Gemeinsames Aussehen der Eingabefelder in diesem Fenster.
const fieldClass =
  "h-11 w-full rounded-md border border-blue-400 px-3 disabled:cursor-not-allowed disabled:border-gray-200 disabled:bg-gray-50";

// FILTER-POP-UP: Geburtsdatum, PLZ und Profilbild einstellen.
export default function FilterPopup({
  value,
  onApply,
  onClose,
}: FilterPopupProps) {
  useLockScroll(); // Sperrt das Scrollen im Hintergrund.
  // Entwurf: Änderungen gelten erst, wenn "Anwenden" gedrückt wird.
  const [draft, setDraft] = useState<ContactFilters>(value);

  // Ändert ein einzelnes Feld im Entwurf.
  const update = (changes: Partial<ContactFilters>) =>
    setDraft((current) => ({ ...current, ...changes }));

  // Ein Jahr gilt erst mit 4 Ziffern als eingegeben.
  const hasYear = /^\d{4}$/.test(draft.year);
  // Wie viele Tage der gewählte Monat hat (Februar im Schaltjahr: 29).
  const daysInMonth = draft.month
    ? new Date(Number(draft.year) || 2000, Number(draft.month), 0).getDate()
    : 31;

  return (
    // Dunkler Hintergrund, der über die gesamte Website gelegt wird.
    <div className="PopUp_Container">
      <div className="LogReg_InnerContainer">
        {/* X-Knopf zum Schließen */}
        <button
          type="button"
          onClick={onClose}
          className="xButton"
          title="Schließen"
        >
          <X size={22} />
        </button>

        <h2 className="mb-6 text-center text-2xl font-bold">Filter</h2>

        <div className="grid gap-6">
          {/* GEBURTSDATUM: Jahr zuerst, Monat und Tag verfeinern. */}
          <fieldset className="grid gap-2">
            <legend className="mb-2 font-semibold text-gray-800">
              Geburtsdatum
            </legend>
            <div className="grid grid-cols-3 gap-2">
              <input
                id="filter-year"
                type="text"
                inputMode="numeric"
                maxLength={4}
                placeholder="Jahr"
                value={draft.year}
                // Nur Ziffern übernehmen. Ohne Jahr gelten Monat und Tag nicht.
                onChange={(e) => {
                  const year = e.target.value.replace(/\D/g, "");
                  update(year ? { year } : { year, month: "", day: "" });
                }}
                className={fieldClass}
              />
              <select
                id="filter-month"
                value={draft.month}
                disabled={!hasYear}
                // Neuer Monat: Tag zurücksetzen, falls er dort nicht existiert.
                onChange={(e) => update({ month: e.target.value, day: "" })}
                className={fieldClass}
              >
                <option value="">Monat</option>
                {MONTHS.map((name, i) => (
                  <option key={name} value={i + 1}>
                    {name}
                  </option>
                ))}
              </select>
              <select
                id="filter-day"
                value={draft.day}
                disabled={!hasYear || !draft.month}
                onChange={(e) => update({ day: e.target.value })}
                className={fieldClass}
              >
                <option value="">Tag</option>
                {Array.from({ length: daysInMonth }, (_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {i + 1}
                  </option>
                ))}
              </select>
            </div>
            <p className="text-sm text-gray-500">
              Nur Jahr: ganzes Jahr. Mit Monat: ganzer Monat. Mit Tag: genau
              dieser Tag.
            </p>
          </fieldset>

          {/* PLZ: findet alle, deren PLZ so beginnt. */}
          <div className="grid gap-2">
            <label htmlFor="filter-plz" className="font-semibold text-gray-800">
              PLZ beginnt mit
            </label>
            <input
              id="filter-plz"
              type="text"
              inputMode="numeric"
              placeholder="z. B. 90"
              value={draft.plz}
              onChange={(e) =>
                update({ plz: e.target.value.replace(/\D/g, "") })
              }
              className={fieldClass}
            />
          </div>

          {/* PROFILBILD: egal, mit oder ohne. */}
          <fieldset className="grid gap-2">
            <legend className="mb-2 font-semibold text-gray-800">
              Profilbild
            </legend>
            {(
              [
                ["all", "Egal"],
                ["with", "Mit Profilbild"],
                ["without", "Ohne Profilbild"],
              ] as const
            ).map(([option, label]) => (
              <label key={option} className="flex items-center gap-2">
                <input
                  type="radio"
                  name="filter-picture"
                  checked={draft.picture === option}
                  onChange={() => update({ picture: option })}
                />
                {label}
              </label>
            ))}
          </fieldset>
        </div>

        {/* AKTIONEN: Zurücksetzen leert die Felder, Anwenden übernimmt sie. */}
        <div className="mt-8 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setDraft(EMPTY_FILTERS)}
            className="buttonsec rounded-md border border-blue-400 p-3 text-blue-400 hover:bg-blue-50"
          >
            Zurücksetzen
          </button>
          <button
            type="button"
            onClick={() =>
              onApply(
                hasYear ? draft : { ...draft, year: "", month: "", day: "" },
              )
            }
            className="buttonsec rounded-md bg-blue-400 p-3 text-white hover:bg-gray-700"
          >
            Anwenden
          </button>
        </div>
      </div>
    </div>
  );
}
