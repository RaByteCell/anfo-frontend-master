Anmeldeformular – Next.js

Dieses Projekt basiert auf Next.js, einem React-Framework zur Entwicklung von Webanwendungen. Das Projekt wurde mit create-next-app erstellt.

Inhaltsverzeichnis
Projektbeschreibung
Verwendete Technologien
Aufbau des Anmeldeformulars
Header-Komponente
Technische Funktionsweise
Installation und Start
Projektstruktur
Aktuelle Einschränkungen und mögliche Erweiterungen
Learn More
Deployment auf Vercel
Projektstatus
Projektbeschreibung

Das Projekt enthält ein Anmeldeformular, das mit React und TypeScript umgesetzt wurde. Die Benutzeroberfläche wird mit Tailwind CSS gestaltet. Für die Validierung der Formulareingaben wird die Bibliothek Zod verwendet.

Zusätzlich besitzt die Anwendung eine Header-Komponente, die ein Logo und einen Reload-Button enthält. Das Logo wird mithilfe der Next.js-Komponente Image dargestellt. Über den Reload-Button kann die aktuelle Seite neu geladen werden.

Das Anmeldeformular ermöglicht die Eingabe folgender Daten:

Vorname
Nachname
Adresse
Postleitzahl (PLZ)
E-Mail-Adresse
Datum

Die Eingaben werden clientseitig überprüft. Bei ungültigen Eingaben werden entsprechende Fehlermeldungen angezeigt. Sobald ein Feld bearbeitet wird, kann die zugehörige Fehlermeldung entfernt werden.

Bei vollständig gültigen Eingaben erscheint eine Erfolgsmeldung.

Wichtig: Aktuell werden keine Formulardaten dauerhaft gespeichert oder an einen Server übermittelt.

Verwendete Technologien
Technologie	Verwendung
Next.js	Framework für die Webanwendung
React	Erstellung der Benutzeroberfläche
TypeScript	Typisierung und bessere Codequalität
Tailwind CSS	Gestaltung und Layout
Zod	Validierung der Formulareingaben
next/image	Einbindung und Darstellung des Logos
Aufbau des Anmeldeformulars

Die Formular-Komponente Second befindet sich in der Datei AnFo_BB.tsx.

Das Formular besteht aus sechs Eingabefeldern und einem Absenden-Button.

Validierungsregeln
Feld	Regel
Vorname	Darf nicht leer sein
Nachname	Darf nicht leer sein
Adresse	Darf nicht leer sein
PLZ	Pflichtfeld, ausschließlich Ziffern
E-Mail	Pflichtfeld, gültiges E-Mail-Format
Datum	Darf nicht leer sein

Die E-Mail-Prüfung kontrolliert das Format der Adresse. Ob die E-Mail-Adresse tatsächlich existiert, wird nicht überprüft.

Header-Komponente

Die Header-Komponente befindet sich in der Datei app/components/Header.tsx.

Sie bildet den oberen Bereich der Anwendung und enthält zwei wesentliche Elemente:

Logo: Wird links im Header angezeigt.
Reload-Button: Befindet sich rechts und lädt die aktuelle Seite bei einem Klick neu.
1. Logo mit next/image

Für die Darstellung des Logos wird die Image-Komponente von Next.js importiert:

import Image from 'next/image';


Das Logo wird folgendermaßen eingebunden:

<Image
  src="/logo-generic.svg"
  alt="Logo"
  width={120}
  height={48}
  priority
/>


Die Eigenschaften haben folgende Bedeutung:

src: Gibt den Pfad zur Bilddatei an.
alt: Beschreibt das Bild für assistive Technologien.
width: Legt die Bildbreite auf 120 Pixel fest.
height: Legt die Bildhöhe auf 48 Pixel fest.
priority: Kennzeichnet das Bild als priorisiert zu ladendes Bild.

Die Datei logo-generic.svg liegt im Ordner public und wird deshalb über den Pfad /logo-generic.svg eingebunden. Ein separater Import der Bilddatei ist in diesem Fall nicht erforderlich.

2. Reload-Button

Der Reload-Button ermöglicht es, die aktuelle Seite erneut zu laden.

Der Button verwendet einen Event-Handler mit der Funktion:

onClick={() => window.location.reload()}


Beim Anklicken wird window.location.reload() ausgeführt. Dadurch wird die aktuelle Seite im Browser neu geladen.

Zusätzlich besitzt der Button die Attribute aria-label und title. Diese beschreiben seine Funktion und verbessern die Bedienbarkeit.

3. Client Component in Next.js

Da der Header einen interaktiven Button mit onClick enthält, muss die Komponente als Client Component ausgeführt werden.

Dafür steht am Anfang der Datei Header.tsx die Direktive:

'use client';


Sie muss vor den Import-Anweisungen stehen.

Next.js verwendet standardmäßig Server Components. Event-Handler wie onClick benötigen jedoch eine Client Component, damit die Interaktion im Browser verarbeitet werden kann.

4. Gestaltung des Reload-Buttons

Die Gestaltung erfolgt über die CSS-Klasse reload-button.

Beispiel:

.reload-button {
  cursor: pointer;
}


Die Eigenschaft cursor: pointer sorgt dafür, dass der Mauszeiger beim Überfahren des Buttons als Hand dargestellt wird. Dadurch wird signalisiert, dass das Element anklickbar ist.

Weitere Gestaltungsmöglichkeiten sind Farben, Abstände, Größen und Hover-Effekte.

5. Einbindung des Headers

Die Komponente wird in app/layout.tsx importiert:

import { Header } from './components/Header';


Innerhalb des Layouts wird sie mit folgendem JSX eingebunden:

<Header />


Dadurch kann der Header im gemeinsamen Layout der Anwendung angezeigt werden.

Technische Funktionsweise
1. Zod-Validierung

Das Objekt formSchema definiert die Regeln für alle Formulareingaben.

z.object() definiert das Schema für die Formulardaten.
z.string() erwartet einen Textwert.
.trim() entfernt führende und nachfolgende Leerzeichen.
.min(1, ...) stellt sicher, dass ein Pflichtfeld nicht leer ist.
.regex(/^[0-9]+$/) stellt sicher, dass die PLZ ausschließlich aus Ziffern besteht.
z.email() überprüft das Format der E-Mail-Adresse.

Die Funktion safeParse() überprüft die Formulardaten, ohne bei ungültigen Eingaben eine Ausnahme auszulösen.

Hier findest du die ausführliche Dokumentation zur
Validierung des Anmeldeformulars mit Zod.

[Zod-Dokumentation als PDF öffnen](./public/zod-dokumentation.pdf)

2. Verwaltung der Eingaben mit useState

Mit Reacts useState werden die aktuellen Eingabewerte in formData verwaltet.

Die Funktion handleChange aktualisiert die Werte, sobald ein Benutzer ein Eingabefeld verändert.

Die Fehlermeldungen werden separat im Zustand errors gespeichert.

3. Formularüberprüfung mit handleSubmit

Die Funktion handleSubmit wird beim Absenden des Formulars ausgeführt.

Sie verhindert das standardmäßige Absenden des HTML-Formulars und überprüft anschließend die Eingaben mithilfe von Zod.

Bei ungültigen Eingaben werden die entsprechenden Fehlermeldungen angezeigt.
Bei gültigen Eingaben werden die Fehlermeldungen entfernt und eine Erfolgsmeldung angezeigt.
4. Gestaltung mit CSS und Tailwind CSS

Die Gestaltung des Formulars erfolgt über CSS-Klassen und Tailwind CSS.

CSS-Klasse	Aufgabe
.mainsec	Hauptbereich und Zentrierung
.containersec	Äußerer Formularcontainer
.tablesec	Anordnung der Formularelemente
.texttisec	Gestaltung der Überschrift
.inputfielsec	Gestaltung der Eingabefelder
.buttonsec	Gestaltung des Absenden-Buttons
.error	Gestaltung der Fehlermeldungen
.Header	Gestaltung des Header-Bereichs
.logo	Positionierung des Logos
.reload-button	Gestaltung des Reload-Buttons

Mit @apply können Tailwind-CSS-Klassen innerhalb eigener CSS-Regeln verwendet werden.

Installation und Start
Voraussetzungen
Node.js
npm (wird mit Node.js installiert)
Git (optional, für die Versionsverwaltung)
1. Abhängigkeiten installieren

Öffne das Terminal im Projektordner und führe folgenden Befehl aus:

npm install


Falls Zod noch nicht installiert ist:

npm install zod

2. Entwicklungsserver starten

Starte die Anwendung mit:

npm run dev


Alternativ kannst du Yarn, pnpm oder Bun verwenden, sofern diese Paketmanager im Projekt eingerichtet sind.

3. Anwendung öffnen

Öffne anschließend folgende Adresse im Browser:

http://localhost:3000/second

Während der Entwicklung werden Änderungen an den entsprechenden Dateien normalerweise automatisch im Browser aktualisiert.

Projektstruktur

Ein möglicher relevanter Aufbau des Projekts sieht folgendermaßen aus:

projekt/
├── app/
│   ├── components/
│   │   └── Header.tsx
│   ├── layout.tsx
│   ├── page.tsx
│   └── second/
│       ├── page.tsx
│       └── AnFo_BB.tsx
├── public/
│   └── logo-generic.svg
├── package.json
└── README.md


Die tatsächliche Struktur kann je nach Projekt abweichen.

app/layout.tsx: Gemeinsames Layout der Anwendung, in das der Header eingebunden wird.
app/page.tsx: Einstiegspunkt der Hauptseite.
app/components/Header.tsx: Header mit Logo und Reload-Button.
app/second/page.tsx: Seite für den zweiten Bereich, sofern dort eingebunden.
app/second/AnFo_BB.tsx: Formular-Komponente mit Validierung.
public/: Öffentliche statische Dateien wie Bilder und Logos.
package.json: Abhängigkeiten und npm-Skripte.
README.md: Projektdokumentation.
Aktuelle Einschränkungen und mögliche Erweiterungen

Der aktuelle Stand umfasst die clientseitige Formularvalidierung, die Anzeige von Fehlermeldungen und die Header-Komponente mit Reload-Funktion.

Folgende Funktionen könnten später ergänzt werden:

Serverseitige Validierung
Speicherung der Anmeldedaten in einer Datenbank
E-Mail-Bestätigung
Erweiterte Prüfung der PLZ
Verbesserungen der Barrierefreiheit
Automatisierte Tests für die Validierungsregeln
Zusätzliche Hover-Animationen für den Reload-Button
Learn More

Weitere Informationen zu den verwendeten Technologien findest du in diesen Ressourcen:

Next.js Documentation – Dokumentation zu Funktionen und APIs.
Learn Next.js – Interaktives Next.js-Tutorial.
Zod Documentation – Dokumentation zur Schema-Validierung.
React Documentation – Dokumentation zu React und Hooks.
Tailwind CSS Documentation – Dokumentation zu Tailwind CSS.

Du kannst auch das Next.js-GitHub-Repository besuchen.

Deployment auf Vercel

Die Anwendung kann mit der Vercel-Plattform bereitgestellt werden.

Weitere Informationen findest du in der Next.js-Deployment-Dokumentation.

Vor der Veröffentlichung sollte geprüft werden, ob alle Abhängigkeiten installiert sind und die Anwendung fehlerfrei gebaut werden kann.

Zum Testen des Produktions-Builds können folgende Befehle verwendet werden:

npm run build
npm run start

Projektstatus

Status: Anmeldeformular mit clientseitiger Validierung durch Zod sowie Header mit Logo und Reload-Funktion.

Die Anwendung zeigt Fehlermeldungen bei ungültigen Eingaben und eine Erfolgsmeldung bei gültigen Eingaben an. Der Header stellt das Logo mithilfe von next/image dar und ermöglicht das Neuladen der aktuellen Seite über einen Button.

Eine dauerhafte Speicherung oder Übermittlung der Formulardaten ist derzeit nicht implementiert.