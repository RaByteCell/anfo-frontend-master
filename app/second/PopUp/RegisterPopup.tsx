"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { X } from "lucide-react";

import { useRegister } from "../hooks/auth_Hooks/useRegister";

type RegisterPopupProps = {
  onClose: () => void;
  onLogin: () => void;
};

const registerSchema = z.object({
  vorname: z.string().trim().min(1, "Vorname ist erforderlich"),
  nachname: z.string().trim().min(1, "Nachname ist erforderlich"),
  email: z.string().trim().email("Ungültige E-Mail-Adresse"),
  password: z.string().min(8, "Passwort muss mindestens 8 Zeichen haben"),
});

type RegisterForm = z.infer<typeof registerSchema>;

export default function RegisterPopup({
  onClose,
  onLogin,
}: RegisterPopupProps) {
  const { mutate, isPending, isError } = useRegister();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = (data: RegisterForm) => {
    mutate(
      {
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

        <h2 className="mb-6 text-center text-2xl font-bold">Registrierung</h2>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid grid-cols-1 gap-5"
        >
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

          <div>
            <input
              type="email"
              placeholder="E-Mail"
              className="inputfielsec"
              {...register("email")}
            />
            {errors.email && <p className="error">{errors.email.message}</p>}
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
              Registrierung fehlgeschlagen. Bitte überprüfe deine Angaben.
            </p>
          )}

          <button
            type="submit"
            disabled={isPending}
            className="rounded-md bg-blue-400 p-3 text-white hover:bg-gray-700 disabled:opacity-50"
          >
            {isPending ? "Registriere..." : "Registrieren"}
          </button>
        </form>

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
