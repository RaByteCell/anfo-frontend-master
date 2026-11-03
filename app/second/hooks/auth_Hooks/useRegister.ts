"use client";

import { useMutation } from "@tanstack/react-query";
import axios from "axios";

export interface RegisterData {
  username: string;
  email: string;
  password: string;
}

const register = async (data: RegisterData) => {
  const response = await axios.post("/api/auth/register", data);
  return response.data;
};

export const useRegister = () => {
  return useMutation({
    mutationFn: register,
  });
};
