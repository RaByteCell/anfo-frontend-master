// Werkzeuge für die Serverroute: Anfrage lesen und Antwort senden.
import { NextRequest, NextResponse } from "next/server";

// Adresse von Strapi, falls keine eigene eingestellt ist: localhost.
const STRAPI_URL = process.env.STRAPI_URL || "http://localhost:1337";

// Legt mit den Formulardaten einen neuen Benutzer in Strapi an.
export async function POST(request: NextRequest) {
  try {
    // Daten aus dem Formular auslesen.
    const { username, email, password } = await request.json();

    // Benutzer bei Strapi registrieren.
    const response = await fetch(`${STRAPI_URL}/api/auth/local/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json", // Die Daten werden als JSON geschickt.
      },
      body: JSON.stringify({
        username,
        email,
        password,
      }),
      cache: "no-store", // Antwort nicht zwischenspeichern.
    });

    // Antwort von Strapi auslesen.
    const result = await response.json();

    // Fehler von Strapi an das Formular weitergeben.
    if (!response.ok) {
      return NextResponse.json(
        { error: result.error?.message || "Registrierung fehlgeschlagen" },
        { status: response.status },
      );
    }

    // Erfolgreiche Registrierung zurückgeben.
    return NextResponse.json({
      message: "Registrierung erfolgreich",
      user: result.user,
    });
  } catch {
    // Unerwarteter Fehler, z. B. wenn Strapi nicht erreichbar ist.
    return NextResponse.json(
      { error: "Serverfehler bei der Registrierung" },
      { status: 500 },
    );
  }
}
