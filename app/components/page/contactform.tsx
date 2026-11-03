"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";
import { Pencil, Trash2, X } from "lucide-react";
import { formatDate } from "@/lib/formatDate";
import { useCreateanfo_contact } from "../../hooks/data_trans/usepost_anfo_contact";
import { useGetanfo_contact } from "../../hooks/data_trans/useget_anfo_contact";
import { useDeleteanfo_contact } from "../../hooks/data_trans/useDelete_anfo_contact";
import { useUpdateanfo_contact } from "../../hooks/data_trans/useUpdate_anfo_contact";

import type { anfo_contact as AnfoContact } from "../../hooks/data_trans/useget_anfo_contact";

// 1. ZOD-SCHEMA
const anfo_contact = z.object({
  vorname: z.string().trim().min(1, "Vorname ist erforderlich"),
  nachname: z.string().trim().min(1, "Nachname ist erforderlich"),
  adresse: z.string().trim().min(1, "Adresse ist erforderlich"),
  plz: z
    .string()
    .trim()
    .min(1, "PLZ ist erforderlich")
    .regex(/^[0-9]+$/, "PLZ darf nur Ziffern enthalten"),
  email: z.email("Bitte gib eine gültige E-Mail ein").trim(),
  bdate: z.coerce.date(),
});

export type FormSchema = z.infer<typeof anfo_contact>;

// 2. FORMULARFELDER
const fields: {
  name: keyof FormSchema;
  placeholder: string;
  type?: string;
}[] = [
  { name: "vorname", placeholder: "Vorname" },
  { name: "nachname", placeholder: "Nachname" },
  { name: "adresse", placeholder: "Adresse" },
  { name: "plz", placeholder: "PLZ" },
  { name: "email", placeholder: "E-Mail" },
  { name: "bdate", placeholder: "", type: "date" },
];

// 3. PAGE
export default function Home() {
  // STRAPI-HOOKS
  const { data: contacts, isLoading, isError } = useGetanfo_contact();
  const { mutate, isSuccess } = useCreateanfo_contact();

  const { mutate: deleteContact, isPending: isDeleting } =
    useDeleteanfo_contact();

  const { mutate: updateContact, isPending: isUpdating } =
    useUpdateanfo_contact();

  // POPUP-STATES
  const [selectedContact, setSelectedContact] = useState<AnfoContact | null>(
    null,
  );

  const [deleteContactData, setDeleteContactData] =
    useState<AnfoContact | null>(null);

  // FORMULARE
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.input<typeof anfo_contact>, unknown, FormSchema>({
    resolver: zodResolver(anfo_contact),
  });

  const {
    register: registerEdit,
    handleSubmit: handleSubmitEdit,
    reset: resetEdit,
    formState: { errors: editErrors },
  } = useForm<z.input<typeof anfo_contact>, unknown, FormSchema>({
    resolver: zodResolver(anfo_contact),
  });

  // POST
  const onSubmit = (data: FormSchema) => mutate(data);

  // EDIT
  const handleEdit = (contact: AnfoContact) => {
    setSelectedContact(contact);

    resetEdit({
      vorname: contact.vorname,
      nachname: contact.nachname,
      adresse: contact.adresse,
      plz: contact.plz,
      email: contact.email,
      bdate: contact.bdate.slice(0, 10),
    });
  };

  const onUpdate = (data: FormSchema) => {
    if (!selectedContact) return;

    updateContact(
      {
        documentId: selectedContact.documentId,
        data: {
          ...data,
          bdate: data.bdate.toISOString().slice(0, 10),
        },
      },
      { onSuccess: () => setSelectedContact(null) },
    );
  };

  // DELETE
  const onDelete = () => {
    if (!deleteContactData) return;

    deleteContact(deleteContactData.documentId, {
      onSuccess: () => setDeleteContactData(null),
    });
  };

  // FORMULARFELDER RENDERN
  const renderFields = (
    registerField: typeof register | typeof registerEdit,
    fieldErrors: typeof errors | typeof editErrors,
  ) =>
    fields.map(({ name, placeholder, type }) => (
      <div key={name} className="relative">
        <input
          className={`inputfielsec ${type === "date" ? "date-input" : ""}`}
          type={type || "text"}
          placeholder={placeholder}
          {...registerField(name)}
        />
        {fieldErrors[name] && (
          <p className="error">{fieldErrors[name]?.message}</p>
        )}
      </div>
    ));

  return (
    <main className="flex flex-1 flex-col items-center gap-8">
      {/* ANMELDEFORMULAR */}
      <div className="containersec mx-auto flex max-w-sm items-center bg-white px-6 py-8 ring shadow-xl ring-gray-900/5">
        <form
          className="ml-5 grid grid-cols-1 gap-y-5"
          onSubmit={handleSubmit(onSubmit)}
        >
          <h1 className="text-center text-3xl font-bold">Anmeldeformular</h1>

          {renderFields(register, errors)}

          <button
            type="submit"
            className="buttonsec mx-auto rounded-md bg-blue-400 p-2 text-center text-white hover:bg-gray-700"
          >
            Absenden
          </button>

          {isSuccess && (
            <p className="text-green-600">
              Benutzer wurde erfolgreich gespeichert!
            </p>
          )}
        </form>
      </div>

      {/* TABELLE */}
      <div className="w-full max-w-5xl overflow-x-auto bg-white p-6 shadow-xl">
        <h2 className="mb-5 text-center text-2xl font-bold">
          Gespeicherte Anmeldungen
        </h2>

        {isLoading && <p>Daten werden geladen...</p>}

        {isError && (
          <p className="text-red-600">
            Fehler beim Laden der Daten aus Strapi.
          </p>
        )}

        {!isLoading && !isError && (
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="bg-gray-700 text-blue-50 text-center">
                {[
                  "Vorname",
                  "Nachname",
                  "Adresse",
                  "PLZ",
                  "E-Mail",
                  "Geburtsdatum",
                  "Verwalten",
                ].map((heading) => (
                  <th key={heading} className="contactview">
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {contacts?.map((contact) => (
                <tr key={contact.id} className="hover:bg-gray-100">
                  <td className="contactview">{contact.vorname}</td>
                  <td className="contactview">{contact.nachname}</td>
                  <td className="contactview">{contact.adresse}</td>
                  <td className="contactview">{contact.plz}</td>
                  <td className="contactview">{contact.email}</td>
                  <td className="contactview">{formatDate(contact.bdate)}</td>

                  <td className="contactview">
                    <div className="flex justify-center gap-3">
                      <button
                        type="button"
                        onClick={() => handleEdit(contact)}
                        className="text-blue-400 hover:text-blue-800"
                        title="Bearbeiten"
                      >
                        <Pencil size={18} />
                      </button>

                      <button
                        type="button"
                        disabled={isDeleting}
                        onClick={() => setDeleteContactData(contact)}
                        className="text-red-600 hover:text-red-800 disabled:opacity-40"
                        title="Löschen"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {contacts?.length === 0 && (
                <tr>
                  <td colSpan={7} className="border p-4 text-center">
                    Keine Anmeldungen vorhanden.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* BEARBEITUNGS-POPUP */}
      {selectedContact && (
        <div className="PopUp_Container">
          <div className="relative mx-auto max-w-sm min-h-[650px] rounded-lg bg-white px-5 pt-13 shadow-xl">
            <button
              type="button"
              onClick={() => setSelectedContact(null)}
              className="xButton"
              title="Schließen"
            >
              <X size={22} />
            </button>

            <h2 className="mb-6 text-center text-2xl font-bold">
              Kontakt bearbeiten
            </h2>

            <form
              onSubmit={handleSubmitEdit(onUpdate)}
              className="grid grid-cols-1 gap-6 px-5"
            >
              {renderFields(registerEdit, editErrors)}

              <div className="PopUp_ActionButton">
                <button
                  type="button"
                  onClick={() => setSelectedContact(null)}
                  className="rounded-md bg-gray-300 px-4 py-2 hover:bg-gray-400"
                >
                  Abbrechen
                </button>

                <button
                  type="submit"
                  disabled={isUpdating}
                  className="rounded-md bg-blue-400 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
                >
                  {isUpdating ? "Speichert..." : "Speichern"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* LÖSCHEN-POPUP */}
      {deleteContactData && (
        <div className="PopUp_Container">
          <div className="relative w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
            <button
              type="button"
              disabled={isDeleting}
              onClick={() => setDeleteContactData(null)}
              className="xButton"
              title="Schließen"
            >
              <X size={22} />
            </button>

            <h2 className="mb-4 text-center text-2xl font-bold">
              Eintrag löschen?
            </h2>

            <p className="mb-3 text-center text-gray-600">
              Soll der Kontakt wirklich gelöscht werden?
            </p>

            <p className="mb-6 text-center text-lg font-semibold">
              {deleteContactData.vorname} {deleteContactData.nachname}
            </p>

            <div className="PopUp_ActionButton">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setDeleteContactData(null)}
                className="rounded-md bg-gray-300 px-4 py-2 hover:bg-gray-400 disabled:opacity-50"
              >
                Abbrechen
              </button>

              <button
                type="button"
                disabled={isDeleting}
                onClick={onDelete}
                className="rounded-md bg-red-600 px-4 py-2 text-white hover:bg-red-800 disabled:opacity-50"
              >
                {isDeleting ? "Wird gelöscht..." : "Ja, löschen"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
