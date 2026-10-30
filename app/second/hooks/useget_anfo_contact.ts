"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";

// 1. Interface für die Daten aus Strapi
export interface anfo_contact {
  id: number;
  documentId: string;
  vorname: string;
  nachname: string;
  adresse: string;
  plz: string;
  email: string;
  bdate: string;
}

// 2. Axios-Verbindung zu Strapi
const api = axios.create({
  baseURL: "http://localhost:1337/api",
});

// 3. GET-Funktion
const get_anfo_contact = async (): Promise<anfo_contact[]> => {
  const { data } = await api.get("/anfo-contacts");

  return data.data;
};

// 4. React Query Hook
export const useGetanfo_contact = () => {
  return useQuery<anfo_contact[]>({
    queryKey: ["anfo_contacts"],
    queryFn: get_anfo_contact,
  });
};
