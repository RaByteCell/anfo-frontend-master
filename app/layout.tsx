"use client";
import "./globals.css";
import { Header } from "./components/header";
import { Footer } from "./components/footer";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <html lang="de">
      <body className="flex min-h-screen flex-col">
        <QueryClientProvider client={queryClient}>
          <Header />
          {children}
          <Footer />
        </QueryClientProvider>
      </body>
    </html>
  );
}
