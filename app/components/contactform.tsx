"use client";
// Import lib
import {
  useContacts,
  useCreateContact,
  useUpdateContact,
  useDeleteContact,
} from "@/lib/contacts";
import {
  contactSchema,
  type Contact,
  type ContactInput,
} from "@/lib/contactZODSchema";
// Import components
import ContactTable from "./contacttable";
import DeletePopup from "./pop-up/delete";
// Import node_modules
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { X } from "lucide-react";

// Form Inputfields
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
  { name: "bdate", placeholder: "", type: "date" },
];

// Page
export default function Home() {
  // Hooks
  const { data: contacts, isLoading, isError } = useContacts();
  const { mutate, isSuccess } = useCreateContact();
  const { mutate: deleteContact, isPending: isDeleting } = useDeleteContact();
  const { mutate: updateContact, isPending: isUpdating } = useUpdateContact();

  // Pop-Ups
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [deleteContactData, setDeleteContactData] = useState<Contact | null>(
    null,
  );

  // Forms
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ContactInput>({ resolver: zodResolver(contactSchema) });
  const {
    register: registerEdit,
    handleSubmit: handleSubmitEdit,
    reset: resetEdit,
    formState: { errors: editErrors },
  } = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
  });

  // Post
  const onSubmit = (data: ContactInput) => mutate(data);

  // Edit
  const handleEdit = (contact: Contact) => {
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
  const onUpdate = (data: ContactInput) => {
    if (!selectedContact) return;

    updateContact(
      { documentId: selectedContact.documentId, data },
      { onSuccess: () => setSelectedContact(null) },
    );
  };

  // Delete
  const onDelete = () => {
    if (!deleteContactData) return;
    deleteContact(deleteContactData.documentId, {
      onSuccess: () => setDeleteContactData(null),
    });
  };

  // Render Fields
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

      {/* CONTACT TABLE - Hier werden alle Einträge aus Strapi/Anfo_Contact als Table angezeigt */}
      <div className="w-full max-w-5xl overflow-x-auto bg-white p-6 shadow-xl">
        <h2 className="mb-5 text-center text-2xl font-bold">
          Gespeicherte Anmeldungen
        </h2>
        {!isLoading && !isError && (
          <ContactTable
            contacts={contacts ?? []}
            isDeleting={isDeleting}
            onEdit={handleEdit}
            onDelete={setDeleteContactData}
          />
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

      {/* DELETE-POPUP - Eintrag wird aus Strapi/Anfo_Contact gelöscht */}
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
