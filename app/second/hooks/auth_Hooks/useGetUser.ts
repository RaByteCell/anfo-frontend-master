"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export interface AuthUser {
  id: number;
  username: string;
  email: string;
}

const getUser = async (): Promise<AuthUser | null> => {
  const { data } = await axios.get("/api/auth/me");
  return data.user;
};

export const useGetUser = () => {
  return useQuery({
    queryKey: ["authUser"],
    queryFn: getUser,
    retry: false,
  });
};
