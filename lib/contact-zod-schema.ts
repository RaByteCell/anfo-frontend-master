import { z } from "zod";

export const contactSchema = z.object({
  vorname: z.string().trim().min(1, "Vorname ist erforderlich"),
  nachname: z.string().trim().min(1, "Nachname ist erforderlich"),
  adresse: z.string().trim().min(1, "Adresse ist erforderlich"),
  plz: z
    .string()
    .trim()
    .min(1, "PLZ ist erforderlich")
    .regex(/^[0-9]+$/, "PLZ darf nur Ziffern enthalten"),
  email: z.email("Bitte gib eine gültige E-Mail ein").trim(),
  bdate: z.iso.date("Bitte Geburtsdatum angeben"),
});

export type ContactInput = z.infer<typeof contactSchema>;
export type Contact = ContactInput & { id: number; documentId: string };
