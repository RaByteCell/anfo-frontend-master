"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";
import FormFields from "../formfields";
import {
  contactSchema,
  type Contact,
  type ContactInput,
} from "@/lib/contactZODSchema";

type EditPopupProps = {
  contact: Contact;
  isUpdating: boolean;
  onSave: (data: ContactInput) => void;
  onClose: () => void;
};

export default function EditPopup({
  contact,
  isUpdating,
  onSave,
  onClose,
}: EditPopupProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      vorname: contact.vorname,
      nachname: contact.nachname,
      adresse: contact.adresse,
      plz: contact.plz,
      email: contact.email,
      bdate: contact.bdate.slice(0, 10),
    },
  });

  return (
    <div className="PopUp_Container">
      <div className="relative mx-auto max-w-sm min-h-[650px] rounded-lg bg-white px-5 pt-13 shadow-xl">
        <button
          type="button"
          onClick={onClose}
          className="xButton"
          title="Schließen"
        >
          <X size={22} />
        </button>

        <h2 className="mb-6 text-center text-2xl font-bold">
          Kontakt bearbeiten
        </h2>

        <form
          onSubmit={handleSubmit(onSave)}
          className="grid grid-cols-1 gap-6 px-5"
        >
          <FormFields register={register} errors={errors} />

          <div className="PopUp_ActionButton">
            <button
              type="button"
              onClick={onClose}
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
  );
}
