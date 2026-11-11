"use client";
import { useQuery } from "@tanstack/react-query";
// Wie axios, erneuert aber abgelaufene Tokens automatisch.
import { api } from "@/lib/api";

export interface AuthUser {
  id: number;
  username: string;
  email: string;
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
