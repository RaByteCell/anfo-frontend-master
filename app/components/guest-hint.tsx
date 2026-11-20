"use client";
// Damit kann sich die Box merken, ob ein Fenster offen ist.
import { useState } from "react";
// Symbol für Kontakte.
import { Users } from "lucide-react";
// Die Fenster für Login und Registrierung.
import LoginPopup from "./pop-up/login";
import RegisterPopup from "./pop-up/register";

// HINWEIS FÜR GÄSTE: Steht an der Stelle des Formulars und lädt zum Anmelden ein.
export default function GuestHint() {
  // Merkt sich, ob das Login- oder Registrieren-Fenster offen ist.
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  return (
    <>
      <div className="cardbox flex w-full max-w-sm shrink-0 flex-col items-center justify-center bg-linear-to-b from-white to-mist-300 text-center">
        {/* Symbol in einem grauen Kreis */}
        <div className="mb-5 flex size-45 items-center justify-center rounded-full bg-white text-blue-400 shadow-md">
          <Users size={80} />
        </div>

        <h2 className="mb-3 text-xl font-bold text-gray-800">
          Kontakte verwalten
        </h2>
        <p className="mb-6 text-gray-500">
          Melde dich an oder erstelle ein Konto, um Kontakte zu verwalten und
          neue hinzuzufügen.
        </p>

        {/* Knöpfe untereinander, so breit wie die Box */}
        <div className="flex w-full flex-col gap-3">
          {/* Hauptknopf: dunkel gefüllt, passend zu Header und Footer */}
          <button
            type="button"
            onClick={() => setShowLogin(true)}
            className="buttonsec rounded-md bg-gray-700 p-3 font-semibold text-white transition-colors hover:bg-gray-800"
          >
            Anmelden
          </button>
          {/* Zweitknopf: nur mit Rahmen */}
          <button
            type="button"
            onClick={() => setShowRegister(true)}
            className="buttonsec rounded-md border border-gray-700 p-3 font-semibold text-gray-700 transition-colors hover:bg-gray-100"
          >
            Registrieren
          </button>
        </div>
      </div>

      {/* Login-Fenster, von hier aus kann man zum Registrieren wechseln. */}
      {showLogin && (
        <LoginPopup
          onClose={() => setShowLogin(false)}
          onRegister={() => {
            setShowLogin(false);
            setShowRegister(true);
          }}
        />
      )}

      {/* Registrieren-Fenster, von hier aus kann man zum Login wechseln. */}
      {showRegister && (
        <RegisterPopup
          onClose={() => setShowRegister(false)}
          onLogin={() => {
            setShowRegister(false);
            setShowLogin(true);
          }}
        />
      )}
    </>
  );
}
