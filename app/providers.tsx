"use client";
// Importiert React Query zur Verwaltung und Bereitstellung von Daten im gesamten Projekt.
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
// Stellt die gemeinsame Datenverwaltung für alle untergeordneten Seiten und Komponenten bereit.
export default function Providers({ children }: { children: React.ReactNode }) {
  // Erstellt einen zentralen Speicher, der geladene Daten zwischenspeichert und verwaltet.
  const [queryClient] = useState(() => new QueryClient());

  return (
    // Ermöglicht allen untergeordneten Komponenten den Zugriff auf React Query.
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
