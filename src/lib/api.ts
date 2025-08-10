import { NextResponse } from "next/server";

export const ok = <T>(data: T, init?: ResponseInit) =>
  NextResponse.json({ ok: true, data }, init);

export const error = (message: string, status = 400, code?: string) =>
  NextResponse.json({ ok: false, error: { message, code } }, { status });
