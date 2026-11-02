"use client";
import Image from "next/image";
import { RotateCw } from "lucide-react";

export const Header = () => {
  return (
    <header className="Header">
      {/* Bild links */}
      <div className=" logo h-12 w-auto">
        <Image
          src="/logo-generic.svg"
          alt="Logo"
          width={180}
          height={48}
          priority
        />
      </div>

      {/* Reload-Button rechts */}
      <button
        type="button"
        className="rounded-full size-13 text-white hover:text-blue-400 hover:border hover:border-blue-400 transition-colors inline-flex ml-auto items-center justify-center"
        onClick={() => window.location.reload()}
        aria-label="Seite neu laden"
        title="Seite neu laden"
      >
        <RotateCw size={34} />
      </button>
    </header>
  );
};
