// Dieser Code läuft im Browser, nicht auf dem Server.
"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
// Legt fest, welche Daten für den Login nötig sind.
export interface LoginData {
  identifier: string; // Benutzername oder E-Mail
  password: string;
}
// Schickt die Login-Daten an den Server und gibt seine Antwort zurück.
const login = async (data: LoginData) => {
  const response = await axios.post("/api/auth/login", data);
  return response.data;
};
// Stellt den Login für andere Teile der App bereit, z. B. für das Login-Formular.
export const useLogin = () => {
  // Zugriff auf die zwischengespeicherten Daten der App.
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: login, // Diese Funktion wird beim Einloggen ausgeführt.
    // Nach erfolgreichem Login: Benutzerdaten neu laden, damit die App den Benutzer als angemeldet erkennt.
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["authUser"] }),
  });
};
