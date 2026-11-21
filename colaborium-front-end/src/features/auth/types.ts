export type AuthUser = {
    id: number;
    nome: string;
    email: string;
    perfil: "USUARIO" | "ADMIN";
};