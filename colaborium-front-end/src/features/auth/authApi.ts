import { tokenStore } from "./tokenStore";
import type { AuthUser } from "./types";

const API_URL = import.meta.env.VITE_API_URL ?? (import.meta.env.PROD ? "/api" : "http://localhost:3333");

type LoginResponse = {
    accessToken: string;
    user: AuthUser;
};

export async function loginRequest(email: string, senha: string): Promise<LoginResponse> {
    const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, senha }),
    });

    if (!response.ok) {
        throw new Error("E-mail ou senha inválidos.");
    }

    return response.json() as Promise<LoginResponse>
}

export async function apiFetch(
    path: string,
    options: RequestInit = {}
) {
    const token = tokenStore.get();

    return fetch(`${API_URL}${path}`, {
        ...options,
        headers: {
            ...options.headers,
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        credentials: "include",
    });
}

export async function meRequest(): Promise<AuthUser> {
    const response = await apiFetch("/auth/me");

    if (!response.ok) {
        throw new Error("Não autenticado.")
    }

    const data = (await response.json()) as { user: AuthUser };
    return data.user;
}