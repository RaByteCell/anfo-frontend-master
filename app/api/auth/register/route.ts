// Werkzeuge für die Serverroute: Anfrage lesen und Antwort senden.
import { NextRequest, NextResponse } from "next/server";

// Adresse von Strapi, falls keine eigene eingestellt ist: localhost.
const STRAPI_URL = process.env.STRAPI_URL || "http://localhost:1337";

// Legt einen neuen Benutzer an und meldet ihn danach direkt an.
export async function POST(request: NextRequest) {
  try {
    // Daten aus dem Formular auslesen. Den Benutzernamen erzeugt der Server selbst.
    const { email, password, vorname, nachname } = await request.json();

    // 1. REGISTRIEREN: Benutzer bei Strapi anlegen.
    const registerResponse = await fetch(
      `${STRAPI_URL}/api/auth/local/register`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // username: zufällige, einmalige Kennung. Angemeldet wird mit der E-Mail.
        body: JSON.stringify({
          username: crypto.randomUUID(),
          email,
          password,
          vorname,
          nachname,
        }),
        cache: "no-store",
      },
    );
    const registerResult = await registerResponse.json();

    // Fehler von Strapi an das Formular weitergeben, z. B. "bereits vergeben".
    if (!registerResponse.ok) {
      return NextResponse.json(
        {
          error:
            registerResult.error?.message || "Registrierung fehlgeschlagen",
        },
        { status: registerResponse.status },
      );
    }

    // 2. ANMELDEN: wie beim normalen Login, damit die Login-Cookies entstehen.
    const loginResponse = await fetch(`${STRAPI_URL}/api/auth/local`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ identifier: email, password }),
      cache: "no-store",
    });
    const loginResult = await loginResponse.json();

    const res = NextResponse.json({
      message: "Registrierung erfolgreich",
      user: registerResult.user,
    });

    // Anmelden hat nicht geklappt: Das Konto existiert trotzdem, man meldet sich dann normal an.
    if (!loginResponse.ok) return res;

    // Access-Token als Cookie speichern, 10 Minuten gültig.
    res.cookies.set("strapi_access", loginResult.jwt, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 600,
    });

    // Refresh-Cookie von Strapi an den Browser weitergeben.
    loginResponse.headers.getSetCookie().forEach((cookie) => {
      res.headers.append("Set-Cookie", cookie);
    });

    return res;
  } catch {
    // Unerwarteter Fehler, z. B. wenn Strapi nicht erreichbar ist.
    return NextResponse.json(
      { error: "Serverfehler bei der Registrierung" },
      { status: 500 },
    );
  }
}
