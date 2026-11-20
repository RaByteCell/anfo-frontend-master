"use client";
// Fragment: fasst Elemente zusammen. useState, useMemo, useEffect: Zustände und Bildvorschau.
import { Fragment, useEffect, useMemo, useState } from "react";
// Formularverwaltung und Prüfung der Eingaben.
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
// Symbole für Schließen, Herunterladen, Bearbeiten und Hochladen.
import { X, Download, Pencil, Upload } from "lucide-react";
import {
  contactSchema,
  type Contact,
  type ContactInput,
} from "@/lib/contact-zod-schema";
import { useUpdateContact } from "@/app/hooks/general/use-contacts";
import { formatDate } from "@/lib/format-date";
import { canManage } from "@/lib/permissions";
import { downloadPicture, getLargePictureUrl } from "@/lib/pictureurl";
// Die gemeinsamen Eingabefelder, wie im Formular "Kontakt anlegen".
import FormFields from "../formfields";
import { useGetUser } from "../../hooks/auth/use-get-user";
// Sperrt das Scrollen der Seite im Hintergrund, solange das Pop-up offen ist.
import { useLockScroll } from "../../hooks/general/use-lock-scroll";

// Legt fest, was das Profil-Pop-up von außen bekommt.
type ProfilePopupProps = {
  contact: Contact;
  startEditing: boolean; // true: öffnet direkt im Bearbeiten-Modus (Stift).
  onClose: () => void;
};

// PROFIL-POP-UP: Zeigt einen Kontakt an und lässt Berechtigte ihn bearbeiten.
export default function ProfilePopup({
  contact,
  startEditing,
  onClose,
}: ProfilePopupProps) {
  useLockScroll(); // Sperrt das Scrollen im Hintergrund.
  const { data: user } = useGetUser();
  const { mutate: updateContact, isPending, isError } = useUpdateContact();
  // Merkt sich, ob der Kontakt gerade angesehen oder bearbeitet wird.
  const [editing, setEditing] = useState(startEditing);
  // Merkt sich das neu gewählte Bild (noch nicht hochgeladen).
  const [picture, setPicture] = useState<File | null>(null);
  // Darf dieser Benutzer den Kontakt bearbeiten? (Besitzer oder Admin)
  const allowed = canManage(user, contact);

  // VORSCHAU: Macht aus der gewählten Datei eine Adresse, die das img anzeigen kann.
  const previewUrl = useMemo(
    () => (picture ? URL.createObjectURL(picture) : null),
    [picture],
  );
  // Gibt den Speicher der alten Vorschau wieder frei, wenn sie nicht mehr gebraucht wird.
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  // FORMULAR: mit den bisherigen Daten vorausgefüllt.
  const {
    register,
    handleSubmit,
    reset,
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

  // SPEICHERN: Bild (falls gewählt) und Daten an Strapi schicken, dann schließen.
  const onSave = (data: ContactInput) =>
    updateContact(
      { documentId: contact.documentId, data, picture },
      { onSuccess: onClose },
    );

  // ABBRECHEN: Eingaben und Bild zurücksetzen. Kam man über den Stift, schließt das Fenster.
  const onCancel = () => {
    reset();
    setPicture(null);
    if (startEditing) onClose();
    else setEditing(false);
  };

  // Die Zeilen der Datenliste: Beschriftung und Wert.
  const details = [
    { label: "Adresse", value: contact.adresse },
    { label: "PLZ", value: contact.plz },
    { label: "E-Mail", value: contact.email },
    { label: "Geburtsdatum", value: formatDate(contact.bdate) },
  ];

  return (
    // Dunkler Hintergrund, der über die gesamte Website gelegt wird.
    <div className="PopUp_Container">
      {/* Fenster: scrollt selbst, falls es höher als der Bildschirm wird. */}
      <div className="LogReg_InnerContainer max-h-[90vh] overflow-y-auto text-center">
        {/* X-Knopf zum Schließen */}
        <button
          type="button"
          onClick={onClose}
          className="xButton"
          title="Schließen"
        >
          <X size={22} />
        </button>

        {/* Großes, rundes Profilbild: zeigt die Vorschau, sobald ein neues gewählt ist. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={previewUrl ?? getLargePictureUrl(contact)}
          alt={`Profilbild von ${contact.vorname} ${contact.nachname}`}
          className="mx-auto size-40 rounded-full object-cover shadow-md"
        />

        {editing ? (
          // BEARBEITEN: neues Bild und dieselben Felder wie beim Anlegen.
          <form
            noValidate
            onSubmit={handleSubmit(onSave)}
            className="mt-6 grid grid-cols-1 gap-5"
          >
            {/* BILD WÄHLEN: Das Label ist der sichtbare Knopf, das echte Dateifeld ist versteckt. */}
            <label className="buttonsec inline-flex items-center justify-center gap-2 rounded-md border border-blue-400 p-3 text-blue-400 hover:bg-blue-50">
              <Upload size={18} />
              <span className="truncate">
                {picture ? picture.name : "Neues Bild auswählen"}
              </span>
              <input
                type="file"
                accept="image/png,image/jpeg,image/webp,image/gif"
                className="hidden"
                onChange={(e) => setPicture(e.target.files?.[0] ?? null)}
              />
            </label>

            <FormFields register={register} errors={errors} />
            {/* Fehlermeldung, z. B. wenn Strapi das Speichern oder Hochladen verweigert. */}
            {isError && <p className="error">Speichern fehlgeschlagen.</p>}
            <div className="PopUp_ActionButton">
              <button
                type="button"
                onClick={onCancel}
                className="buttonsec rounded-md bg-gray-300 px-4 py-2 hover:bg-gray-400"
              >
                Abbrechen
              </button>
              <button
                type="submit"
                disabled={isPending}
                className="buttonsec rounded-md bg-blue-400 px-4 py-2 text-white hover:bg-gray-700 disabled:opacity-50"
              >
                {isPending ? "Speichert..." : "Speichern"}
              </button>
            </div>
          </form>
        ) : (
          // ANSICHT: Name, Daten, Herunterladen und (falls erlaubt) Bearbeiten.
          <>
            <h2 className="mt-4 text-2xl font-bold text-gray-800">
              {contact.vorname} {contact.nachname}
            </h2>

            {/* DATEN: links die Beschriftung, rechts der Wert */}
            <dl className="mt-6 grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-left">
              {details.map(({ label, value }) => (
                <Fragment key={label}>
                  <dt className="text-gray-500">{label}</dt>
                  <dd>{value}</dd>
                </Fragment>
              ))}
            </dl>

            <div className="mt-6 flex flex-col gap-3">
              {/* DOWNLOAD: nur, wenn es ein eigenes Bild gibt. */}
              {contact.profilepicture && (
                <button
                  type="button"
                  onClick={() => downloadPicture(contact)}
                  className="buttonsec inline-flex items-center justify-center gap-2 rounded-md border border-blue-400 p-3 text-blue-400 hover:bg-blue-50"
                >
                  <Download size={18} />
                  Bild herunterladen
                </button>
              )}
              {/* BEARBEITEN: nur für Besitzer oder Admin. */}
              {allowed && (
                <button
                  type="button"
                  onClick={() => setEditing(true)}
                  className="buttonsec inline-flex items-center justify-center gap-2 rounded-md bg-blue-400 p-3 text-white hover:bg-gray-700"
                >
                  <Pencil size={18} />
                  Bearbeiten
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
