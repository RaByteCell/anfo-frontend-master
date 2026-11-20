import { NextRequest } from "next/server";
import { forwardToStrapi } from "@/lib/strapi-proxy";

// HOCHLADEN: Datei mit Login an Strapi schicken.
export async function POST(request: NextRequest) {
  return forwardToStrapi(request, "/upload", "POST");
}
