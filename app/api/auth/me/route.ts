import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const STRAPI_URL = process.env.STRAPI_URL || "http://localhost:1337";

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get("strapi_access")?.value;

  if (!token) {
    return NextResponse.json({ user: null });
  }

  try {
    const response = await fetch(`${STRAPI_URL}/api/users/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    if (!response.ok) {
      return NextResponse.json({ user: null });
    }

    const user = await response.json();

    return NextResponse.json({ user });
  } catch {
    return NextResponse.json({ user: null });
  }
}
