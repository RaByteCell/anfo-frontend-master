// Dieser Code läuft im Browser.
"use client";
// Werkzeuge zum Senden von Daten an den Server und für die zwischengespeicherten Daten.
import { useMutation, useQueryClient } from "@tanstack/react-query";
// Schickt Anfragen an den Server.
import axios from "axios";
// Bittet den Server, den Benutzer abzumelden.
const logout = async () => {
  await axios.post("/api/auth/logout");
};
// Stellt den Logout für die App bereit, z. B. für den Logout-Knopf im Header.
export const useLogout = () => {
  // Zugriff auf die zwischengespeicherten Daten der App.
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: logout, // Diese Funktion wird beim Abmelden ausgeführt.
    onSuccess: () => {
      // Benutzer sofort aus dem Zwischenspeicher entfernen, damit der Name verschwindet.
      queryClient.setQueryData(["authUser"], null);
    },
  });
};
