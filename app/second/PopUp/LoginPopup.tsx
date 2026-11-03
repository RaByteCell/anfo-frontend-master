"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { X } from "lucide-react";

import { useLogin } from "../hooks/auth_Hooks/useLogin";

const loginSchema = z.object({
  identifier: z.string().trim().email("Ungültige E-Mail-Adresse"),
  password: z.string().min(1, "Passwort erforderlich"),
});

type LoginForm = z.infer<typeof loginSchema>;

type LoginPopupProps = {
  onClose: () => void;
  onRegister: () => void;
};

export default function LoginPopup({ onClose, onRegister }: LoginPopupProps) {
  const { mutate, isPending, isError } = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginForm) => {
    mutate(data, {
      onSuccess: () => {
        onClose();
      },
    });
  };

  return (
    <div className="PopUp_Container">
      <div className="LogReg_InnerContainer">
        <button
          type="button"
          onClick={onClose}
          className="xButton"
          title="Schließen"
        >
          <X size={22} />
        </button>

        <h2 className="mb-6 text-center text-2xl font-bold">Login</h2>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid grid-cols-1 gap-5"
        >
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

          {isError && (
            <p className="error">
              Anmeldung fehlgeschlagen. Bitte überprüfe deine Zugangsdaten.
            </p>
          )}

          <button
            type="submit"
            disabled={isPending}
            className="rounded-md bg-blue-400 p-3 text-white hover:bg-gray-700 disabled:opacity-50"
          >
            {isPending ? "Anmelden..." : "Anmelden"}
          </button>
        </form>

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
