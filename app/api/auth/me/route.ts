import { cookies } from "next/headers";
import { NextResponse } from "next/server";
const STRAPI_URL = process.env.STRAPI_URL || "http://localhost:1337";
// Antwort, die im Frontend die Token-Erneuerung auslöst.
const needsRefresh = () =>
  NextResponse.json({ error: "Token abgelaufen" }, { status: 401 });
// Gibt den angemeldeten Benutzer zurück.
export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get("strapi_access")?.value;
  const refreshToken = cookieStore.get("strapi_up_refresh")?.value;
  if (!token) {
    // Access-Token weg, aber Refresh-Token da: Erneuerung möglich.
    if (refreshToken) return needsRefresh();
    // Kein Token vorhanden: Besucher ist nicht angemeldet.
    return NextResponse.json({ user: null });
  }
  try {
    const response = await fetch(`${STRAPI_URL}/api/users/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });
    // Strapi lehnt das Token ab: wenn möglich erneuern.
    if (response.status === 401 && refreshToken) return needsRefresh();
    if (!response.ok) {
      return NextResponse.json({ user: null });
    }
    const user = await response.json();
    return NextResponse.json({ user });
  } catch {
    return NextResponse.json({ user: null });
  }
}
