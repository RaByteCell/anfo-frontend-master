// Importiert Zod zur Überprüfung der eingegebenen Formulardaten.
import { z } from "zod";
// Legt fest, welche Angaben erforderlich sind und welche Regeln sie erfüllen müssen.
export const contactSchema = z.object({
  // Vorname: Darf nicht leer sein. Leerzeichen am Anfang und Ende werden entfernt.
  vorname: z.string().trim().min(1, "Vorname ist erforderlich"),
  // Nachname: Darf nicht leer sein. Leerzeichen am Anfang und Ende werden entfernt.
  nachname: z.string().trim().min(1, "Nachname ist erforderlich"),
  // Adresse: Muss ausgefüllt werden.
  adresse: z.string().trim().min(1, "Adresse ist erforderlich"),
  // PLZ: Muss ausgefüllt sein und darf ausschließlich aus Ziffern bestehen.
  plz: z
    .string()
    .trim()
    .min(1, "PLZ ist erforderlich")
    .regex(/^[0-9]+$/, "PLZ darf nur Ziffern enthalten"),
  // E-Mail: Muss eine gültige E-Mail-Adresse enthalten.
  email: z.email("Bitte gib eine gültige E-Mail ein").trim(),
  // Geburtsdatum: Muss angegeben werden und ein gültiges Datumsformat besitzen.
  bdate: z.iso.date("Bitte Geburtsdatum angeben"),
});
// Erstellt automatisch den passenden Datentyp anhand der festgelegten Eingaberegeln.
export type ContactInput = z.infer<typeof contactSchema>;
// Erweitert die Formulardaten um eine eindeutige ID, eine Dokument-ID und die URL zum Profilbild für gespeicherte Kontakte.
export type Contact = ContactInput & {
  id: number;
  documentId: string;
  profilepicture?: {
    url: string;
    name: string;
    formats?: { thumbnail?: { url: string } };
  } | null;
};
