// Dieser Code läuft im Browser.
"use client";
// Werkzeug zum Senden von Daten an den Server.
import { useMutation } from "@tanstack/react-query";
// Schickt Anfragen an den Server.
import axios from "axios";
// Legt fest, welche Daten für die Registrierung nötig sind.
export interface RegisterData {
  username: string;
  email: string;
  password: string;
}
// Schickt die Registrierungsdaten an den Server.
const register = async (data: RegisterData) => {
  const response = await axios.post("/api/auth/register", data);
  return response.data;
};
// Stellt die Registrierung für das Formular bereit.
export const useRegister = () => {
  return useMutation({
    mutationFn: register, // Diese Funktion wird beim Registrieren ausgeführt.
  });
};
