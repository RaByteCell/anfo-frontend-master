import { NextRequest, NextResponse } from "next/server";

const STRAPI_URL = process.env.STRAPI_URL || "http://localhost:1337";

export async function POST(request: NextRequest) {
  try {
    const { username, email, password } = await request.json();

    // Benutzer bei Strapi registrieren
    const response = await fetch(`${STRAPI_URL}/api/auth/local/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        email,
        password,
      }),
      cache: "no-store",
    });

    const result = await response.json();

    // Fehler von Strapi weitergeben
    if (!response.ok) {
      return NextResponse.json(
        { error: result.error?.message || "Registrierung fehlgeschlagen" },
        { status: response.status },
      );
    }

    // Erfolgreiche Registrierung zurückgeben
    return NextResponse.json({
      message: "Registrierung erfolgreich",
      user: result.user,
    });
  } catch {
    return NextResponse.json(
      { error: "Serverfehler bei der Registrierung" },
      { status: 500 },
    );
  }
}
