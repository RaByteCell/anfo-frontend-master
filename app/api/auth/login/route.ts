// Werkzeuge für die Serverroute: Anfrage lesen und Antwort senden.
import { NextRequest, NextResponse } from "next/server";

// Adresse von Strapi, falls keine eigene eingestellt ist: localhost.
const STRAPI_URL = process.env.STRAPI_URL || "http://localhost:1337";

// Meldet den Benutzer bei Strapi an und speichert die Tokens als Cookies.
export async function POST(request: NextRequest) {
  try {
    // E-Mail und Passwort aus dem Formular auslesen.
    const { identifier, password } = await request.json();

    // Zugangsdaten von Strapi prüfen lassen.
    const response = await fetch(`${STRAPI_URL}/api/auth/local`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json", // Die Daten werden als JSON geschickt.
      },
      body: JSON.stringify({
        identifier,
        password,
      }),
      cache: "no-store", // Antwort nicht zwischenspeichern.
    });

    // Antwort von Strapi auslesen.
    const result = await response.json();

    // Login fehlgeschlagen: Fehler an das Formular weitergeben.
    if (!response.ok) {
      return NextResponse.json(
        { error: result.error?.message || "Login fehlgeschlagen" },
        { status: response.status },
      );
    }

    // Antwort mit den Benutzerdaten vorbereiten.
    const res = NextResponse.json({
      user: result.user,
    });

    // Access-Token als Cookie speichern, 10 Minuten gültig.
    // httpOnly: Code im Browser kann das Cookie nicht auslesen.
    res.cookies.set("strapi_access", result.jwt, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 600,
    });

    // Refresh-Cookie von Strapi an den Browser weitergeben.
    const cookies = response.headers.getSetCookie();

    cookies.forEach((cookie) => {
      res.headers.append("Set-Cookie", cookie);
    });

    return res;
  } catch {
    // Unerwarteter Fehler, z. B. wenn Strapi nicht erreichbar ist.
    return NextResponse.json(
      { error: "Serverfehler beim Login" },
      { status: 500 },
    );
  }
}
