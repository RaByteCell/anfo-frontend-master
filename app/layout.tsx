// Importiert die globalen CSS-Einstellungen für das gesamte Design der Website.
import "./globals.css";
// Importiert die zentrale Datenverwaltung für alle Seiten und Komponenten.
import Providers from "./providers";
// Importiert Kopf- und Fußbereich der Website.
import { Header } from "./components/header";
import { Footer } from "./components/footer";
// Grundgerüst der gesamten Website: Wird von allen Seiten gemeinsam verwendet.
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de">
      {/* Sorgt dafür, dass die Website mindestens die gesamte Bildschirmhöhe einnimmt. */}
      <body className="flex min-h-screen flex-col">
        {/* Stellt die gemeinsame Datenverwaltung für alle Seiten bereit. */}
        <Providers>
          {/* Kopfbereich mit Navigation und weiteren Elementen. */}
          <Header />
          {/* Hier wird jeweils der Inhalt der aktuell geöffneten Seite angezeigt. */}
          {children}
          {/* Fußbereich der Website, der auf allen Seiten erscheint. */}
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
