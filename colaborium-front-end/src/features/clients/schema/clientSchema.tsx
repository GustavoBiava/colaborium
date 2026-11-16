import { z } from "zod";

export const clientSchema = z
  .object({
    // Company information
    nome_empresa: z.string({ error: () => "Nome obrigatório" }),
    email: z.email("E-mail inválido"),
    cnpj_cpf_empresa: z.string({ error: () => "CNPJ/CPF obrigatório" }).refine((e) => {
      const digits = e.replace(/\D/g, "");
      return digits.length === 14 || digits.length === 11;
    }, "Quantidade de dígitos inválido"),
    telefone: z
      .string({ error: () => "Telefone obrigatório" })
      .refine(
        (e) => e.replace(/\D/g, "").length === 11,
        "Telefone deve ter 11 dígitos",
      ),
    ie: z.string().max(14, "IE não deve conter mais que 14 dígitos").optional(),
    isento: z.boolean().optional(),

    // Company location
    complemento_empresa: z.string().optional(),
    cep_empresa: z
      .string({ error: () => "CEP obrigatório" })
      .refine((e) => e.length >= 8, "Quantidade de dígitos inválido"),
    endereco_empresa: z
      .string({ error: () => "Endereço obrigatório" })
      .min(1, "Endereço obrigatório"),
    numero_empresa: z
      .string({ error: () => "Número obrigatório" })
      .min(1, "Número obrigatório"),
    bairro_empresa: z
      .string({ error: () => "Bairro obrigatório" })
      .min(1, "Bairro obrigatório"),
    cidade_empresa: z
      .string({ error: () => "Cidade obrigatória" })
      .min(1, "Cidade obrigatória"), //should we use a external api to feed our selects?
    estado_empresa: z
      .string({ error: () => "Estado obrigatório" })
      .min(1, "Estado obrigatório"),

    // Company representative information
    cpf_representante: z.string({ error: () => "CPF obrigatório" }).refine((e) => {
      const digits = e.replace(/\D/g, "");
      return digits.length === 14 || digits.length === 11;
    }, "Quantidade de dígitos inválido"),
    nome_representante: z.string({ error: () => "Nome obrigatório" }),
    nacionalidade_representante: z.string({ error: () => "Nacionalidade obrigatória" }),
    estado_civil_representante: z.string({ error: () => "Estado Civil obrigatório" }),
    cargo_representante: z.string({ error: () => "Cargo obrigatório" }),

    // Company representative location
    complemento_representante: z.string().optional(),
    cep_representante: z
      .string({ error: () => "CEP obrigatório" })
      .refine((e) => e.length >= 8, "Quantidade de dígitos inválido"),
    endereco_representante: z
      .string({ error: () => "Endereço obrigatório" })
      .min(1, "Endereço obrigatório"),
    numero_representante: z
      .string({ error: () => "Número obrigatório" })
      .min(1, "Número obrigatório"),
    bairro_representante: z
      .string({ error: () => "Bairro obrigatório" })
      .min(1, "Bairro obrigatório"),
    cidade_representante: z
      .string({ error: () => "Cidade obrigatória" })
      .min(1, "Cidade obrigatória"), //should we use a external api to feed our selects?
    estado_representante: z
      .string({ error: () => "Estado obrigatório" })
      .min(1, "Estado obrigatório"),
  })
  .superRefine((data, ctx) => {
    if (!data.isento && (!data.ie || data.ie.trim() === "")) {
      ctx.addIssue({
        code: "custom",
        message: "IE é obrigatória quando não isento",
        path: ["ie"],
      });
    } else if ((data.ie?.length ?? 0) < 8 && !data.isento) {
      ctx.addIssue({
        code: "custom",
        message: "IE deve conter pelo menos 8 dígitos",
        path: ["ie"],
      });
    }
  });

export type ClientFormData = z.infer<typeof clientSchema>;
