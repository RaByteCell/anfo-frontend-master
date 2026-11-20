// Dieser Code läuft im Browser.
"use client";
// Werkzeug zum Senden von Daten an den Server.
import { useMutation, useQueryClient } from "@tanstack/react-query";
// Schickt Anfragen an den Server.
import axios from "axios";
// Legt fest, welche Daten für die Registrierung nötig sind.
export interface RegisterData {
  email: string;
  password: string;
  vorname: string;
  nachname: string;
}
// Schickt die Registrierungsdaten an den Server.
const register = async (data: RegisterData) => {
  const response = await axios.post("/api/auth/register", data);
  return response.data;
};
// Stellt die Registrierung für das Formular bereit.
export const useRegister = () => {
  // Zugriff auf die zwischengespeicherten Daten der App.
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: register,
    // Nach der Registrierung ist man angemeldet: Benutzerdaten neu laden.
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["authUser"] }),
  });
};
