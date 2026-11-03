"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

export interface Updateanfo_contact {
  vorname: string;
  nachname: string;
  adresse: string;
  plz: string;
  email: string;
  bdate: string;
}

interface Updateanfo_contact_params {
  documentId: string;
  data: Updateanfo_contact;
}

const api = axios.create({
  baseURL: "http://localhost:1337/api",
});

const update_anfo_contact = async ({
  documentId,
  data,
}: Updateanfo_contact_params) => {
  const { data: response } = await api.put(`/anfo-contacts/${documentId}`, {
    data,
  });

  return response.data;
};

export const useUpdateanfo_contact = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: update_anfo_contact,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["anfo_contacts"],
      });
    },
  });
};
