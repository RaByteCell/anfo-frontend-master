import type { AuthUser } from "@/app/hooks/auth/use-get-user";

// ANZEIGENAME: Vor- und Nachname, bei alten Konten ohne diese Felder der Benutzername.
export function getDisplayName(user: AuthUser) {
  const name = [user.vorname, user.nachname].filter(Boolean).join(" ");
  return name || user.username;
}
