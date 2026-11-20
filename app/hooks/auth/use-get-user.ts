"use client";
import { useQuery } from "@tanstack/react-query";
// Wie axios, erneuert aber abgelaufene Tokens automatisch.
import { api } from "@/lib/api";

// Legt fest, welche Daten ein angemeldeter Benutzer hat.
export interface AuthUser {
  id: number;
  username: string;
  email: string;
  vorname?: string; // aus Strapi, beim Registrieren gesetzt
  nachname?: string;
  role?: { type: string; name: string }; // z. B. "authenticated" oder "admin"
}
// Holt den angemeldeten Benutzer vom Server.
const getUser = async (): Promise<AuthUser | null> => {
  try {
    const { data } = await api.get("/api/auth/me");
    return data.user;
  } catch {
    // Erneuerung fehlgeschlagen: gilt als nicht angemeldet.
    return null;
  }
};
export const useGetUser = () => {
  return useQuery({
    queryKey: ["authUser"],
    queryFn: getUser,
    retry: false,
  });
};
