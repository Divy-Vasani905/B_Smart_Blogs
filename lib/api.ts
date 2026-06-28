import axios from "axios";
import type { ApiResponse } from "@/types/api.types";

export const api = axios.create({
  withCredentials: true,
  validateStatus: () => true,
});

export function isOk(status: number) {
  return status >= 200 && status < 300;
}

export type { ApiResponse };
