"use client";

import { useMutation } from "@tanstack/react-query";
import axios from "axios";

export interface LoginData {
  identifier: string;
  password: string;
}

const login = async (data: LoginData) => {
  const response = await axios.post("/api/auth/login", data);
  return response.data;
};

export const useLogin = () => {
  return useMutation({
    mutationFn: login,
  });
};
