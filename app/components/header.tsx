// Dieser Code läuft im Browser, weil er auf Klicks reagiert.
"use client";
// Bild-Baustein von Next.js, lädt Bilder optimiert (hier das Logo).
import Image from "next/image";
// Fertige Symbole für die Knöpfe: Neu laden, Benutzer und Logout.
import { RotateCw, User, LogOut } from "lucide-react";
// Damit kann sich die Seite Zustände merken, z. B. ob ein Fenster offen ist.
import { useState } from "react";
// Die Fenster für Login und Registrierung.
import LoginPopup from "./pop-up/login";
import RegisterPopup from "./pop-up/register";
// Eigene Funktionen: angemeldeten Benutzer holen und ausloggen.
import { useGetUser } from "../hooks/auth/use-get-user";
import { useLogout } from "../hooks/auth/use-logout";
// Die Kopfzeile der Seite mit Logo, Login/Logout und Neu-laden-Knopf.
export const Header = () => {
  // Merkt sich, ob das Login- oder Registrieren-Fenster offen ist (am Anfang geschlossen).
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  // Holt den angemeldeten Benutzer und prüft, ob er noch geladen wird.
  const { data: user, isLoading } = useGetUser();
  // Stellt die Logout-Funktion bereit.
  const { mutate: logout } = useLogout();
  return (
    <>
      <header className="Header">
        {/* Logo */}
        <div className="logo h-12 w-auto">
          <Image
            src="/logo-generic.svg"
            alt="Logo"
            width={180}
            height={48}
            priority // Logo sofort laden, weil es ganz oben sichtbar ist.
          />
        </div>
        {/* Bereich rechts in der Kopfzeile */}
        <div className="ml-auto flex items-center gap-5">
          {/* Erst anzeigen, wenn klar ist, ob jemand angemeldet ist. */}
          {!isLoading &&
            (user ? (
              // Angemeldet: Benutzername und Logout-Knopf anzeigen.
              <>
                <span className="flex items-center gap-2 text-white">
                  <User size={22} />
                  {user.username}
                </span>

                <button
                  type="button"
                  onClick={() => logout()}
                  className="logstatus"
                >
                  <LogOut size={22} />
                  Logout
                </button>
              </>
            ) : (
              // Nicht angemeldet: Login-Knopf anzeigen, er öffnet das Login-Fenster.
              <button
                type="button"
                onClick={() => setShowLogin(true)}
                className="logstatus"
              >
                <User size={25} />
                Login
              </button>
            ))}
          {/* Lädt die ganze Seite neu. */}
          <button
            type="button"
            className="logstatus justify-center"
            onClick={() => window.location.reload()}
            aria-label="Seite neu laden" // Beschreibung für Screenreader, da der Knopf nur ein Symbol zeigt.
          >
            <RotateCw size={25} />
          </button>
        </div>
      </header>
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
};
