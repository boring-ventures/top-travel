import { NextResponse } from "next/server";
import axios from "axios";

// Create axios instance with base configuration
// Using relative URLs for API routes so it works in all environments
const api = axios.create({
  headers: {
    "Content-Type": "application/json",
  },
});

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error);
    return Promise.reject(error);
  }
);

export { api };

export const ok = <T>(data: T, init?: ResponseInit) =>
  NextResponse.json({ ok: true, data }, init);

export const error = (message: string, status = 400, code?: string) =>
  NextResponse.json({ ok: false, error: { message, code } }, { status });
