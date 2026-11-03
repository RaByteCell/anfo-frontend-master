import axios from "axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Contact, ContactInput } from "./contactZODSchema";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:1337/api",
});

const KEY = ["anfo_contacts"];

export const useContacts = () =>
  useQuery({
    queryKey: KEY,
    queryFn: async () =>
      (await api.get<{ data: Contact[] }>("/anfo-contacts")).data.data,
  });

// Gemeinsamer Baustein: führt eine Aktion aus und lädt danach die Liste neu
function useContactMutation<V>(action: (vars: V) => Promise<unknown>) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: action,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: KEY }),
  });
}

export const useCreateContact = () =>
  useContactMutation((data: ContactInput) =>
    api.post("/anfo-contacts", { data }),
  );

export const useUpdateContact = () =>
  useContactMutation(
    ({ documentId, data }: { documentId: string; data: ContactInput }) =>
      api.put(`/anfo-contacts/${documentId}`, { data }),
  );

export const useDeleteContact = () =>
  useContactMutation((documentId: string) =>
    api.delete(`/anfo-contacts/${documentId}`),
  );
