import { NextRequest } from "next/server";
import { forwardToStrapi } from "@/lib/strapi-proxy";

// ERSTELLEN: Neuen Kontakt mit Login an Strapi schicken.
export async function POST(request: NextRequest) {
  return forwardToStrapi(request, "/anfo-contacts", "POST");
}
