"use client";

import Image from "next/image";
import { RotateCw, User, LogOut } from "lucide-react";
import { useState } from "react";

import LoginPopup from "./pop-up/login";
import RegisterPopup from "./pop-up/register";
import { useGetUser } from "../hooks/auth/useGetUser";
import { useLogout } from "../hooks/auth/useLogout";

export const Header = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  const { data: user, isLoading } = useGetUser();
  const { mutate: logout } = useLogout();

  return (
    <>
      <header className="Header">
        <div className="logo h-12 w-auto">
          <Image
            src="/logo-generic.svg"
            alt="Logo"
            width={180}
            height={48}
            priority
          />
        </div>

        <div className="ml-auto flex items-center gap-5">
          {!isLoading &&
            (user ? (
              <>
                <span className="flex items-center gap-2 text-white">
                  <User size={22} />
                  {user.username}
                </span>

                <button
                  type="button"
                  onClick={() => logout()}
                  className="inline-flex items-center gap-2 text-white hover:text-blue-400"
                >
                  <LogOut size={22} />
                  Logout
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => setShowLogin(true)}
                className="inline-flex items-center gap-2 text-white hover:text-blue-400"
              >
                <User size={25} />
                Login
              </button>
            ))}

          <button
            type="button"
            className="rounded-full size-13 text-white hover:text-blue-400 hover:border hover:border-blue-400 transition-colors inline-flex items-center justify-center"
            onClick={() => window.location.reload()}
            aria-label="Seite neu laden"
          >
            <RotateCw size={34} />
          </button>
        </div>
      </header>

      {showLogin && (
        <LoginPopup
          onClose={() => setShowLogin(false)}
          onRegister={() => {
            setShowLogin(false);
            setShowRegister(true);
          }}
        />
      )}

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
