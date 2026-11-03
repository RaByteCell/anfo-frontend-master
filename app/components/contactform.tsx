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
import FormFields from "./formfields";
import EditPopup from "./pop-up/edit";
// Import node_modules
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

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

  // Post
  const onSubmit = (data: ContactInput) => mutate(data);

  // Edit
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
  return (
    <main className="flex flex-1 flex-col items-center gap-8">
      {/* ANMELDEFORMULAR */}
      <div className="containersec mx-auto flex max-w-sm items-center bg-white px-6 py-8 ring shadow-xl ring-gray-900/5">
        <form
          className="ml-5 grid grid-cols-1 gap-y-5"
          onSubmit={handleSubmit(onSubmit)}
        >
          <h1 className="text-center text-3xl font-bold">Anmeldeformular</h1>

          <FormFields register={register} errors={errors} />

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
            onEdit={setSelectedContact}
            onDelete={setDeleteContactData}
          />
        )}
      </div>

      {/* EDIT-POPUP - Ausgewählter Eintrag wird im bearbeitungs-Modus angezeigt */}
      {selectedContact && (
        <EditPopup
          contact={selectedContact}
          isUpdating={isUpdating}
          onSave={onUpdate}
          onClose={() => setSelectedContact(null)}
        />
      )}

      {/* DELETE-POPUP - Ausgewählter Eintrag wird aus Strapi/Anfo_Contact gelöscht */}
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
