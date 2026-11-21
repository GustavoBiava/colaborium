import { z } from "zod";

const requiredText = (max: number) =>
    z.string().trim().min(1, "Campo obrigatório").max(max);

const customerFieldsSchema = {
    // Dados da empresa
    nome_empresa: requiredText(150),
    cpf_cnpj_empresa: requiredText(20),
    ie: z.string().trim().min(1).max(30).nullable(),
    email: z.email().max(150),
    telefone: requiredText(30),

    // Endereço da empresa
    endereco_empresa: requiredText(200),
    numero_empresa: requiredText(10),
    complemento_empresa: z.string().max(100).optional(),
    bairro_empresa: requiredText(100),
    cidade_empresa: requiredText(100),
    estado_empresa: requiredText(50),
    cep_empresa: requiredText(10),

    // Dados do representante
    nome_representante: requiredText(150),
    cpf_representante: requiredText(20),
    nacionalidade_representante: z.string().max(50).optional(),
    estado_civil_representante: requiredText(30),
    cargo_representante: requiredText(100),

    // Endereço do representante
    endereco_representante: requiredText(200),
    numero_representante: requiredText(10),
    complemento_representante: z.string().max(100).optional(),
    bairro_representante: requiredText(100),
    cidade_representante: requiredText(100),
    estado_representante: requiredText(50),
    cep_representante: requiredText(10)
};

export const createCustomerSchema = z.object({
    ...customerFieldsSchema
});

export type createCustomerDTO = z.infer<typeof createCustomerSchema>;

export const updateCustomerSchema = z.object({
    ...customerFieldsSchema,
    ativo: z.boolean()
});

export type updateCustomerDTO = z.infer<typeof updateCustomerSchema>;
