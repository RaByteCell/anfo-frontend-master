import { NextRequest, NextResponse } from "next/server";

// Adresse von Strapi, falls keine eigene eingestellt ist: localhost.
const STRAPI_URL = process.env.STRAPI_URL || "http://localhost:1337";

// Leitet eine Anfrage mit dem Login-Token an Strapi weiter.
export async function forwardToStrapi(
  request: NextRequest,
  path: string,
  method: "POST" | "PUT" | "DELETE",
) {
  const token = request.cookies.get("strapi_access")?.value;

  // Kein Token: 401, damit das Frontend ein neues holt.
  if (!token) {
    return NextResponse.json({ error: "Nicht angemeldet" }, { status: 401 });
  }

  const headers: Record<string, string> = {
    Authorization: `Bearer ${token}`, // Zeigt Strapi, wer die Anfrage schickt.
  };

  // Daten mitschicken: Dateien als Formular, alles andere als JSON.
  let body: BodyInit | undefined;
  if (method !== "DELETE") {
    const isFile = request.headers
      .get("content-type")
      ?.startsWith("multipart/form-data");
    if (isFile) {
      body = await request.formData();
    } else {
      headers["Content-Type"] = "application/json";
      body = await request.text();
    }
  }

  try {
    const response = await fetch(`${STRAPI_URL}/api${path}`, {
      method,
      headers,
      body,
      cache: "no-store",
    });

    // Antwort von Strapi unverändert zurückgeben, auch Fehler wie 403.
    const text = await response.text();
    return new NextResponse(text || null, {
      status: response.status,
      headers: { "Content-Type": "application/json" },
    });
  } catch {
    // Unerwarteter Fehler, z. B. wenn Strapi nicht erreichbar ist.
    return NextResponse.json({ error: "Serverfehler" }, { status: 500 });
  }
}
