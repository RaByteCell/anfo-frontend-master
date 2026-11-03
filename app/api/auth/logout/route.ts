import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const response = NextResponse.json({
    message: "Logout erfolgreich",
  });

  const cookies = request.cookies.getAll();

  cookies
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
        maxAge: 0,
      });
    });

  return response;
}
