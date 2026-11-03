import { NextRequest, NextResponse } from "next/server";

const STRAPI_URL = process.env.STRAPI_URL || "http://localhost:1337";

export async function POST(request: NextRequest) {
  try {
    const { identifier, password } = await request.json();

    // LOGIN BEI STRAPI
    const response = await fetch(`${STRAPI_URL}/api/auth/local`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        identifier,
        password,
      }),
      cache: "no-store",
    });

    const result = await response.json();

    // FEHLER
    if (!response.ok) {
      return NextResponse.json(
        { error: result.error?.message || "Login fehlgeschlagen" },
        { status: response.status },
      );
    }

    // ANTWORT ERSTELLEN
    const res = NextResponse.json({
      user: result.user,
    });

    // ACCESS TOKEN ALS HTTP-ONLY COOKIE
    res.cookies.set("strapi_access", result.jwt, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 600,
    });

    // REFRESH COOKIE VON STRAPI WEITERGEBEN
    const cookies = response.headers.getSetCookie();

    cookies.forEach((cookie) => {
      res.headers.append("Set-Cookie", cookie);
    });

    return res;
  } catch {
    return NextResponse.json(
      { error: "Serverfehler beim Login" },
      { status: 500 },
    );
  }
}
