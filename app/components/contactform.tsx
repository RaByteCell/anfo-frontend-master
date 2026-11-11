"use client";
// Importiert die Funktionen zur Verwaltung und Überprüfung der Formulareingaben.
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
// Importiert die Funktion zum Speichern eines neuen Kontakts.
import { useCreateContact } from "@/lib/contacts";
// Importiert die Regeln zur Überprüfung der Formulareingaben.
import { contactSchema, type ContactInput } from "@/lib/contact-zod-schema";
import FormFields from "./formfields";

// ANMELDEFORMULAR: Hier können neue Kontakte eingetragen und gespeichert werden.
export default function ContactForm() {
  const { mutate: createContact, isSuccess } = useCreateContact();

  // Verbindet die Formulareingaben mit der automatischen Überprüfung der Daten.
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactInput>({ resolver: zodResolver(contactSchema) });

  // Speichert den Kontakt und leert danach das Formular.
  const onSubmit = (data: ContactInput) =>
    createContact(data, { onSuccess: () => reset() });

  return (
    <div className="cardbox flex w-full max-w-sm shrink-0 flex-col">
      <h1 className="headtitle pb-7">Kontakt anlegen</h1>
      <form
        noValidate
        className="grid w-full flex-1 grid-cols-1 content-center gap-y-5"
        onSubmit={handleSubmit(onSubmit)}
      >
        {/* Zeigt alle Eingabefelder und mögliche Fehlermeldungen an. */}
        <FormFields register={register} errors={errors} />
        <button
          type="submit"
          className="buttonsec rounded-md bg-blue-400 p-3 text-white hover:bg-gray-700"
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
  );
}
