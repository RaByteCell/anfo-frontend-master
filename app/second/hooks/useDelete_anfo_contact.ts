"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:1337/api",
});

const delete_anfo_contact = async (documentId: string): Promise<void> => {
  await api.delete(`/anfo-contacts/${documentId}`);
};

export const useDeleteanfo_contact = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: delete_anfo_contact,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["anfo_contacts"],
      });
    },
  });
};
