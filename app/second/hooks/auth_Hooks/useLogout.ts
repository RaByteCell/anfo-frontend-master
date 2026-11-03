"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const logout = async () => {
  await axios.post("/api/auth/logout");
};

export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      queryClient.setQueryData(["authUser"], null);
    },
  });
};
