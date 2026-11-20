import { NextRequest } from "next/server";
import { forwardToStrapi } from "@/lib/strapi-proxy";

// Der Platzhalter [documentId] aus dem Ordnernamen.
type Params = { params: Promise<{ documentId: string }> };

// BEARBEITEN
export async function PUT(request: NextRequest, { params }: Params) {
  const { documentId } = await params;
  return forwardToStrapi(request, `/anfo-contacts/${documentId}`, "PUT");
}

// LÖSCHEN
export async function DELETE(request: NextRequest, { params }: Params) {
  const { documentId } = await params;
  return forwardToStrapi(request, `/anfo-contacts/${documentId}`, "DELETE");
}
