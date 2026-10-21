"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";
import { useCreateanfo_contact } from "./hooks/usepost_anfo_contact";

// 1. ZOD Validierungsregeln
const anfo_contact = z.object({
  vorname: z.string().trim().min(1, "Vorname ist erforderlich"),
  nachname: z.string().trim().min(1, "Nachname ist erforderlich"),
  adresse: z.string().trim().min(1, "Adresse ist erforderlich"),
  plz: z
    .string()
    .trim()
    .min(1, "PLZ ist erforderlich")
    .regex(/^[0-9]+$/, "PLZ darf nur Ziffern enthalten"),
  email: z.email("Bitte gib eine gültige E-Mail ein").trim(),
  bdate: z.coerce.date(),
});

export type FormSchema = z.infer<typeof anfo_contact>;

export default function Home() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<
    z.input<typeof anfo_contact>,
    unknown,
    z.output<typeof anfo_contact>
  >({
    resolver: zodResolver(anfo_contact),
  });

  const { mutate, isSuccess } = useCreateanfo_contact();

  const onSubmit = (data: FormSchema) => {
    mutate(data);
  };

  return (
    <main className="flex flex-1 justify-center">
      <div className="containersec mx-auto flex max-w-sm items-center bg-white px-6 py-8 ring shadow-xl ring-gray-900/5">
        <form
          className="ml-5 grid grid-cols-1 gap-y-5"
          onSubmit={handleSubmit(onSubmit)}
        >
          <h1 className="font-bold text-center text-3xl">Anmeldeformular</h1>
          <input
            className="inputfielsec"
            placeholder="Vorname"
            {...register("vorname")}
          />
          {errors.vorname && <p className="error">{errors.vorname.message}</p>}
          <input
            className="inputfielsec"
            placeholder="Nachname"
            {...register("nachname")}
          />
          {errors.nachname && (
            <p className="error">{errors.nachname.message}</p>
          )}
          <input
            className="inputfielsec"
            placeholder="Adresse"
            {...register("adresse")}
          />
          {errors.adresse && <p className="error">{errors.adresse.message}</p>}
          <input
            className="inputfielsec"
            placeholder="PLZ"
            {...register("plz")}
          />
          {errors.plz && <p className="error">{errors.plz.message}</p>}
          <input
            className="inputfielsec"
            placeholder="E-Mail"
            {...register("email")}
          />
          {errors.email && <p className="error">{errors.email.message}</p>}
          <input className="inputfielsec" type="date" {...register("bdate")} />
          {errors.bdate && <p className="error">{errors.bdate.message}</p>}
          <button
            type="submit"
            className="buttonsec mx-auto  bg-blue-400 rounded-md p-2 text-white text-center hover:bg-gray-700"
          >
            Absenden
          </button>
          {isSuccess && (
            <p className="text-green-600">
              Benutzer wurde erfolgreich gespeichert!
            </p>
          )}
        </form>
      </div>
    </main>
  );
}
