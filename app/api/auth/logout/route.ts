// Werkzeuge für die Serverroute: Anfrage lesen und Antwort senden.
import { NextRequest, NextResponse } from "next/server";

// Adresse von Strapi, falls keine eigene eingestellt ist: localhost.
const STRAPI_URL = process.env.STRAPI_URL || "http://localhost:1337";

// Beendet die Sitzung bei Strapi und löscht die Cookies im Browser.
export async function POST(request: NextRequest) {
  // Tokens aus den Cookies des Browsers lesen.
  let token = request.cookies.get("strapi_access")?.value;
  const refreshToken = request.cookies.get("strapi_up_refresh")?.value;

  try {
    // Access-Token abgelaufen: neues holen, weil Strapi es für den Logout verlangt.
    if (!token && refreshToken) {
      const refreshResponse = await fetch(`${STRAPI_URL}/api/auth/refresh`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // Die Daten werden als JSON geschickt.
          Cookie: `strapi_up_refresh=${refreshToken}`,
        },
        body: JSON.stringify({ refreshToken }),
        cache: "no-store", // Antwort nicht zwischenspeichern.
      });

      // Erneuerung erfolgreich: neues Access-Token übernehmen.
      if (refreshResponse.ok) {
        const result = await refreshResponse.json();
        token = result.jwt;
      }
    }

    // Sitzung bei Strapi beenden, damit das Refresh-Token ungültig wird.
    if (token) {
      await fetch(`${STRAPI_URL}/api/auth/logout`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`, // Zeigt Strapi, wer sich abmeldet.
        },
        cache: "no-store",
      });
    }
  } catch {
    // Strapi nicht erreichbar: Im Browser wird trotzdem abgemeldet.
  }

  // Antwort an den Browser vorbereiten.
  const response = NextResponse.json({
    message: "Logout erfolgreich",
  });

  // Access- und Refresh-Cookies im Browser löschen.
  request.cookies
    .getAll()
    .filter(
      (cookie) =>
        cookie.name === "strapi_access" || cookie.name.includes("refresh"),
    )
    .forEach((cookie) => {
      response.cookies.set(cookie.name, "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 0, // Läuft sofort ab, der Browser löscht das Cookie dadurch.
      });
    });

  return response;
}
