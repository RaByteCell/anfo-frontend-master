import type { FieldErrors, UseFormRegister } from "react-hook-form";
import type { ContactInput } from "@/lib/contactZODSchema";

const fields: {
  name: keyof ContactInput;
  placeholder: string;
  type?: string;
}[] = [
  { name: "vorname", placeholder: "Vorname" },
  { name: "nachname", placeholder: "Nachname" },
  { name: "adresse", placeholder: "Adresse" },
  { name: "plz", placeholder: "PLZ" },
  { name: "email", placeholder: "E-Mail" },
  { name: "bdate", placeholder: "", type: "date" },
];

type FormFieldsProps = {
  register: UseFormRegister<ContactInput>;
  errors: FieldErrors<ContactInput>;
};

export default function FormFields({ register, errors }: FormFieldsProps) {
  return (
    <>
      {fields.map(({ name, placeholder, type }) => (
        <div key={name} className="relative">
          <input
            className={`inputfielsec ${type === "date" ? "date-input" : ""}`}
            type={type || "text"}
            placeholder={placeholder}
            {...register(name)}
          />
          {errors[name] && <p className="error">{errors[name]?.message}</p>}
        </div>
      ))}
    </>
  );
}
