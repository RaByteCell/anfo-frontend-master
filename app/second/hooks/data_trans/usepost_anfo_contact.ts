"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

export interface anfo_contact {
  vorname: string;
  nachname: string;
  adresse: string;
  plz: string;
  email: string;
  bdate: Date;
}

export type Createanfo_contact = Omit<anfo_contact, "id">;

const api = axios.create({
  baseURL: "http://localhost:1337/api",
});

const createanfo_contact = async (
  anfo_contact: Createanfo_contact,
): Promise<anfo_contact> => {
  const { data } = await api.post("/anfo-contacts", {
    data: anfo_contact,
  });

  return data.data;
};

export const useCreateanfo_contact = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createanfo_contact,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["anfo_contacts"],
      });
    },
  });
};
