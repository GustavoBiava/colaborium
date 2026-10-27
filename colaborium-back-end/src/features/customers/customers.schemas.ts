import { z } from "zod";

export const createCustomerSchema = z.object({
    nome: z.string().max(150),
    cnpj_cpf: z.string().max(20),
    email: z.email(),
    telefone: z.string(30),
    endereco: z.string(200),
    // numero: z.string(5),
    bairro: z.string(100),
    cidade: z.string(100),
    estado: z.string(50),
    cep: z.string(10),
    ie: z.string(30)
});

export type createCustomerDTO = z.infer<typeof createCustomerSchema>;

export const updateCustomerSchema = z.object({
    nome: z.string().max(255),
    email: z.email(),
    senha: z.string(),
    perfil: z.enum(["USUARIO", "ADMIN"]),
    ativo: z.boolean()
});

export type updateCustomerDTO = z.infer<typeof updateCustomerSchema>;