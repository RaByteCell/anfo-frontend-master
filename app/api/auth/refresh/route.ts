// Werkzeuge für die Serverroute: Anfrage lesen und Antwort senden.
import { NextRequest, NextResponse } from "next/server";

// Adresse von Strapi, falls keine eigene eingestellt ist: localhost.
const STRAPI_URL = process.env.STRAPI_URL || "http://localhost:1337";

// Holt mit dem Refresh-Token ein neues Access-Token.
export async function POST(request: NextRequest) {
  try {
    // Refresh-Token aus den Cookies des Browsers lesen.
    const refreshToken = request.cookies.get("strapi_up_refresh")?.value;

    // Ohne Refresh-Token ist niemand angemeldet.
    if (!refreshToken) {
      return NextResponse.json({ error: "Nicht angemeldet" }, { status: 401 });
    }

    // Refresh-Token bei Strapi gegen neue Tokens tauschen.
    const response = await fetch(`${STRAPI_URL}/api/auth/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json", // Die Daten werden als JSON geschickt.
        Cookie: `strapi_up_refresh=${refreshToken}`,
      },
      body: JSON.stringify({ refreshToken }),
      cache: "no-store", // Antwort nicht zwischenspeichern.
    });

    // Refresh abgelaufen oder ungültig: alte Cookies löschen.
    if (!response.ok) {
      const res = NextResponse.json(
        { error: "Sitzung abgelaufen" },
        { status: 401 },
      );
      res.cookies.delete("strapi_access");
      res.cookies.delete("strapi_up_refresh");
      res.cookies.delete("strapi_up_refresh.sig");
      return res;
    }

    // Antwort von Strapi auslesen und Erfolg melden.
    const result = await response.json();
    const res = NextResponse.json({ ok: true });

    // Neues Access-Token speichern, 10 Minuten gültig.
    // httpOnly: Code im Browser kann das Cookie nicht auslesen.
    res.cookies.set("strapi_access", result.jwt, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 600,
    });

    // Neues Refresh-Cookie von Strapi an den Browser weitergeben.
    response.headers.getSetCookie().forEach((cookie) => {
      res.headers.append("Set-Cookie", cookie);
    });

    return res;
  } catch {
    // Unerwarteter Fehler, z. B. wenn Strapi nicht erreichbar ist.
    return NextResponse.json(
      { error: "Serverfehler beim Erneuern" },
      { status: 500 },
    );
  }
}
