"use client";
// Importiert die Funktionen zur Verwaltung und Überprüfung der Formulareingaben.
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
// Importiert das X-Symbol zum Schließen des Pop-ups.
import { X } from "lucide-react";
// Importiert die Funktion zur Anmeldung eines Benutzers.
import { useLogin } from "../../hooks/auth/use-login";
// LOGIN-ÜBERPRÜFUNG: Legt fest, welche Angaben für die Anmeldung erforderlich sind.
const loginSchema = z.object({
  identifier: z.string().trim().email("Ungültige E-Mail-Adresse"),
  password: z.string().min(1, "Passwort erforderlich"),
});
// Erstellt den passenden Datentyp anhand der festgelegten Anmeldedaten.
type LoginForm = z.infer<typeof loginSchema>;
// Legt fest, welche Funktionen das Anmeldefenster von außen erhält.
type LoginPopupProps = {
  onClose: () => void;
  onRegister: () => void;
};
// LOGIN-POP-UP: Ermöglicht Benutzern die Anmeldung mit ihren Zugangsdaten.
export default function LoginPopup({ onClose, onRegister }: LoginPopupProps) {
  // Stellt die Anmeldefunktion bereit und erkennt laufende oder fehlgeschlagene Anmeldungen
  const { mutate, isPending, isError } = useLogin();
  // FORMULAR: Verwaltet die Eingaben und überprüft sie anhand der festgelegten Regeln.
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });
  // ANMELDUNG: Übermittelt die Zugangsdaten und schließt das Fenster bei erfolgreicher Anmeldung.
  const onSubmit = (data: LoginForm) => {
    mutate(data, {
      onSuccess: () => {
        onClose();
      },
    });
  };
  return (
    // Dunkler Hintergrund, der über die gesamte Website gelegt wird.
    <div className="PopUp_Container">
      {/* FENSTERINHALT: Enthält das Anmeldeformular und den Registrierungsbereich. */}
      <div className="LogReg_InnerContainer">
        {/* Schließt das Anmeldefenster. */}
        <button
          type="button"
          onClick={onClose}
          className="xButton"
          title="Schließen"
        >
          <X size={22} />
        </button>
        {/* Überschrift des Anmeldefensters. */}
        <h2 className="mb-6 text-center text-2xl font-bold">Login</h2>
        {/* ANMELDEFORMULAR: Nimmt die Zugangsdaten entgegen und überprüft diese. */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid grid-cols-1 gap-5"
        >
          {/* EINGABE E-MAIL: Prüft, ob eine gültige E-Mail-Adresse angegeben wurde. */}
          <div>
            <input
              type="email"
              placeholder="E-Mail"
              className="inputfielsec"
              {...register("identifier")}
            />
            {errors.identifier && (
              <p className="error">{errors.identifier.message}</p>
            )}
          </div>
          {/* EINGABE PASSWORT: Nimmt das Passwort entgegen und blendet die Eingabe aus. */}
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
          {/* FEHLERMELDUNG: Wird angezeigt, wenn die Anmeldung nicht erfolgreich war. */}
          {isError && (
            <p className="error">
              Anmeldung fehlgeschlagen. Bitte überprüfe deine Zugangsdaten.
            </p>
          )}
          {/* Startet die Anmeldung und zeigt währenddessen einen Ladehinweis an. */}
          <button
            type="submit"
            disabled={isPending}
            className="rounded-md bg-blue-400 p-3 text-white hover:bg-gray-700 disabled:opacity-50"
          >
            {isPending ? "Anmelden..." : "Anmelden"}
          </button>
        </form>
        {/* REGISTRIERUNG: Bietet neuen Benutzern den Wechsel zum Registrierungsfenster an. */}
        <div className="mt-6 text-center">
          <p className="text-gray-600">Noch keinen Account?</p>
          <button
            type="button"
            onClick={onRegister}
            className="mt-2 font-semibold text-blue-500 hover:text-blue-700"
          >
            Jetzt registrieren
          </button>
        </div>
      </div>
    </div>
  );
}
