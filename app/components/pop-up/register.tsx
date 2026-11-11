"use client";
// Importiert die Funktionen zur Verwaltung und Überprüfung der Formulareingaben.
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
// Zum Auslesen der Fehlermeldung vom Server.
import axios from "axios";
// Importiert das X-Symbol zum Schließen des Pop-ups.
import { X } from "lucide-react";
// Importiert die Funktion zur Registrierung eines neuen Benutzers.
import { useRegister } from "../../hooks/auth/use-register";
// Legt fest, welche Funktionen das Registrierungsfenster von außen erhält.
type RegisterPopupProps = {
  onClose: () => void;
  onLogin: () => void;
};
// REGISTRIERUNGS-ÜBERPRÜFUNG: Legt fest, welche Angaben für die Registrierung erforderlich sind.
const registerSchema = z.object({
  vorname: z.string().trim().min(1, "Vorname ist erforderlich"),
  nachname: z.string().trim().min(1, "Nachname ist erforderlich"),
  email: z.string().trim().email("Ungültige E-Mail-Adresse"),
  password: z.string().min(8, "Passwort muss mindestens 8 Zeichen haben"),
});
// Erstellt den passenden Datentyp anhand der festgelegten Registrierungsdaten.
type RegisterForm = z.infer<typeof registerSchema>;
// REGISTRIERUNGS-POP-UP: Ermöglicht neuen Benutzern, einen Account zu erstellen.
export default function RegisterPopup({
  onClose,
  onLogin,
}: RegisterPopupProps) {
  // Stellt die Registrierungsfunktion bereit und erkennt laufende oder fehlgeschlagene Registrierungen.
  const { mutate, isPending, isError, error } = useRegister();
  // Prüft, ob die E-Mail oder der Name bereits vergeben ist.
  const isAlreadyTaken =
    axios.isAxiosError(error) &&
    error.response?.data?.error?.includes("already taken");
  // FORMULAR: Verwaltet die Eingaben und überprüft sie anhand der festgelegten Regeln.
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });
  // REGISTRIERUNG: Übermittelt die Benutzerdaten und wechselt bei Erfolg zum Login.
  const onSubmit = (data: RegisterForm) => {
    mutate(
      {
        // Fügt Vor- und Nachnamen zu einem gemeinsamen Benutzernamen zusammen.
        username: `${data.vorname} ${data.nachname}`,
        email: data.email,
        password: data.password,
      },
      {
        onSuccess: () => {
          onLogin();
        },
      },
    );
  };
  return (
    // Dunkler Hintergrund, der über die gesamte Website gelegt wird.
    <div className="PopUp_Container">
      {/* FENSTERINHALT: Enthält das Registrierungsformular und den Login-Bereich. */}
      <div className="LogReg_InnerContainer">
        {/* Schließt das Registrierungsfenster. */}
        <button
          type="button"
          onClick={onClose}
          className="xButton"
          title="Schließen"
        >
          <X size={22} />
        </button>
        {/* Überschrift des Registrierungsfensters. */}
        <h2 className="mb-6 text-center text-2xl font-bold">Registrierung</h2>
        {/* REGISTRIERUNGSFORMULAR: Nimmt die persönlichen Daten und Zugangsdaten entgegen. */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid grid-cols-1 gap-5"
        >
          {/* VORNAME: Nimmt den Vornamen entgegen und prüft, ob das Feld ausgefüllt ist. */}
          <div>
            <input
              type="text"
              placeholder="Vorname"
              className="inputfielsec"
              {...register("vorname")}
            />
            {errors.vorname && (
              <p className="error">{errors.vorname.message}</p>
            )}
          </div>
          {/* NACHNAME: Nimmt den Nachnamen entgegen und prüft, ob das Feld ausgefüllt ist. */}
          <div>
            <input
              type="text"
              placeholder="Nachname"
              className="inputfielsec"
              {...register("nachname")}
            />
            {errors.nachname && (
              <p className="error">{errors.nachname.message}</p>
            )}
          </div>
          {/* E-MAIL: Nimmt die E-Mail-Adresse entgegen und überprüft deren Gültigkeit. */}
          <div>
            <input
              type="email"
              placeholder="E-Mail"
              className="inputfielsec"
              {...register("email")}
            />
            {errors.email && <p className="error">{errors.email.message}</p>}
          </div>
          {/* PASSWORT: Nimmt das Passwort entgegen und verlangt mindestens 8 Zeichen. */}
          <div>
            <input
              type="password"
              placeholder="Passwort"
              className="inputfielsec"
              {...register("password")}
            />
            {errors.password && (
              <p className="error">{errors.password.message}</p>
            )}
          </div>
          {/* FEHLERMELDUNG: Wird angezeigt, wenn die Registrierung nicht erfolgreich war. */}
          {isError && (
            <p className="error">
              {isAlreadyTaken
                ? "E-Mail-Adresse oder Vor- und Nachnamen existiert bereits."
                : "Registrierung fehlgeschlagen. Bitte überprüfe deine Angaben."}
            </p>
          )}
          {/* Startet die Registrierung und zeigt währenddessen einen Ladehinweis an. */}
          <button
            type="submit"
            disabled={isPending}
            className="rounded-md bg-blue-400 p-3 text-white hover:bg-gray-700 disabled:opacity-50"
          >
            {isPending ? "Registriere..." : "Registrieren"}
          </button>
        </form>
        {/* LOGIN: Ermöglicht bereits registrierten Benutzern den Wechsel zum Anmeldefenster. */}
        <div className="mt-5 text-center">
          <p className="text-gray-600">Account bereits vorhanden?</p>
          <button
            type="button"
            onClick={onLogin}
            className="mt-2 font-semibold text-blue-500 hover:text-blue-700"
          >
            Zum Login
          </button>
        </div>
      </div>
    </div>
  );
}
