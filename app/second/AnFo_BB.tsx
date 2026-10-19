import React, { useState } from 'react';
import * as z from "zod";

// 1. ZOD Validierungsregeln
const formSchema = z.object({
  vorname: z.string().trim().min(1, 'Vorname ist erforderlich'),
  nachname: z.string().trim().min(1, 'Nachname ist erforderlich'),
  adresse: z.string().trim().min(1, 'Adresse ist erforderlich'),
  plz: z .string() .trim() .min(1, 'PLZ ist erforderlich') .regex(/^[0-9]+$/, 'PLZ darf nur Ziffern enthalten'),
  email: z .string() .trim() .min(1, 'E-Mail ist erforderlich') .pipe(z.email('Bitte gib eine gültige E-Mail ein')),
  datum: z.string().min(1, 'Datum ist erforderlich'),
                          });

export const Second = () => {
  // Values
  const [formData, setFormData] = useState({
    vorname: '',
    nachname: '',
    adresse: '',
    plz: '',
    email: '',
    datum: '',
  });

  // Fehlermeldungen
  const [errors, setErrors] = useState<
    Partial<Record<keyof typeof formData, string>>
  >({});

// Eingaben aktualisieren und erneut validieren
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    const field = name as keyof typeof formData;

    const updatedFormData = {
      ...formData,
      [field]: value,
    };

    setFormData(updatedFormData);

    // Das geänderte Feld mit ZOD überprüfen
    const result = formSchema.shape[field].safeParse(value);

    // Fehlermeldung aktualisieren
    setErrors((prev) => ({
      ...prev,
      [field]: result.success
        ? undefined
        : result.error.issues[0].message,
    }));
  };

  // Formularprüfung
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const result = formSchema.safeParse(formData);

    if (!result.success) {
      const newErrors: Partial<
        Record<keyof typeof formData, string>
      > = {};

      for (const issue of result.error.issues) {
        const field = issue.path[0] as keyof typeof formData;

        if (!newErrors[field]) {
          newErrors[field] = issue.message;
        }
      }

      setErrors(newErrors);
      return;
    }

    setErrors({});
    alert('Wurde erfolgreich abgesendet! :)');
  };

  return (
  <main className="mainsec">
    <div className="containersec">
      <div className="tablesec">
        <h1 className="texttisec">Anmeldeformular</h1>
        <form onSubmit={handleSubmit} noValidate>
            <input className="inputfielsec" placeholder="Vorname" name="vorname" value={formData.vorname} onChange={handleChange} />
            {errors.vorname && (
              <p className="error">{errors.vorname}</p>
            )}
            <input className="inputfielsec" placeholder="Nachname" name="nachname" value={formData.nachname} onChange={handleChange} />
            {errors.nachname && (
              <p className="error">{errors.nachname}</p>
            )}
            <input className="inputfielsec" placeholder="Adresse" name="adresse" value={formData.adresse} onChange={handleChange} />
            {errors.adresse && (
              <p className="error">{errors.adresse}</p>
            )}
            <input className="inputfielsec" placeholder="PLZ" name="plz" value={formData.plz} onChange={handleChange} />
            {errors.plz && (
              <p className="error">{errors.plz}</p>
            )}
            <input className="inputfielsec" placeholder="E-Mail" name="email" value={formData.email} onChange={handleChange} />
            {errors.email && (
              <p className="error">{errors.email}</p>
            )}
            <input className="inputfielsec" type="date" name="datum" value={formData.datum} onChange={handleChange} />
            {errors.datum && (
              <p className="error">{errors.datum}</p>
            )}
            <button type="submit" className="buttonsec">Absenden</button>
        </form>
    </div>
  </div>
</main>
  )
}
