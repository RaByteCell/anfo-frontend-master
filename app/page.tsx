"use client"
import Image from "next/image";

export default function Home() {
  return (
    <div className="grid grid-cols-1 gap-2 w-40 text-2xl">
      <h1 className="font-bold underline">Anmeldeformular</h1>
      <input placeholder="Vorname" className="input"></input>
      <input placeholder="Nachname" className="input"></input>
      <input placeholder="Adresse" className="input"></input>
      <input placeholder="PLZ" className="input"></input>
      <input placeholder="E-Mail" className="input"></input>
      <input type="date" className="input"></input>
      <button className="bg-blue-500">Klick me</button>
    </div>
  );
}
