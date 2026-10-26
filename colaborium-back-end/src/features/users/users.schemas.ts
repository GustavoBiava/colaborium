import { z } from "zod";

export const createUserSchema = z.object({
    nome: z.string().max(255),
    email: z.email(),
    senha: z.string(),
    perfil: z.enum(["USUARIO", "ADMIN"])
});

export type createUserDTO = z.infer<typeof createUserSchema>;