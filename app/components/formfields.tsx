// Importiert die benötigten Funktionen und Datentypen zur Verwaltung und Überprüfung der Formulareingaben.
import type { FieldErrors, UseFormRegister } from "react-hook-form";
import type { ContactInput } from "@/lib/contact-zod-schema";
// Legt fest, welche Eingabefelder im Anmeldeformular angezeigt werden.
const fields: {
  name: keyof ContactInput;
  placeholder: string;
  type?: string;
}[] = [
  { name: "vorname", placeholder: "Vorname" },
  { name: "nachname", placeholder: "Nachname" },
  { name: "adresse", placeholder: "Adresse" },
  { name: "plz", placeholder: "PLZ" },
  { name: "email", placeholder: "E-Mail" },
  { name: "bdate", placeholder: "Geburtsdatum", type: "date" },
];
// Legt fest, welche Formulardaten und Fehlermeldungen die Komponente erhält.
type FormFieldsProps = {
  register: UseFormRegister<ContactInput>;
  errors: FieldErrors<ContactInput>;
};
// Erstellt die Eingabefelder und zeigt bei Bedarf passende Fehlermeldungen an.
export default function FormFields({ register, errors }: FormFieldsProps) {
  return (
    <>
      {/* Erstellt für jedes Feld aus der Liste automatisch ein eigenes Eingabefeld. */}
      {fields.map(({ name, placeholder, type }) => (
        <div key={name} className="relative">
          <input
            // Verwendet für alle Felder ein einheitliches Design und passt Datumsfelder gesondert an.
            className={`inputfielsec ${type === "date" ? "date-input" : ""}`}
            // Legt fest, ob ein normales Textfeld oder ein Datumsfeld angezeigt wird.
            type={type || "text"}
            placeholder={placeholder}
            // Damit das CSS erkennt, ob das Datumsfeld leer ist.
            required={type === "date"}
            // Verbindet das Eingabefeld mit der Formularverwaltung und Datenüberprüfung.
            {...register(name)}
          />
          {/* Ersatz-Text, weil Datumsfelder keinen Platzhalter anzeigen. */}
          {type === "date" && (
            <span className="date-placeholder">{placeholder}</span>
          )}
          {/* Zeigt eine Fehlermeldung an, wenn die eingegebenen Daten nicht gültig sind. */}
          {errors[name] && <p className="error">{errors[name]?.message}</p>}
        </div>
      ))}
    </>
  );
}
