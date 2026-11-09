import { z } from "zod";

export const clientSchema = z
  .object({
    name: z.string({ error: () => "Nome obrigatório" }),
    email: z.email("E-mail inválido"),
    cnpj_cpf: z.string({ error: () => "CNPJ/CPF obrigatório" }).refine((e) => {
      const digits = e.replace(/\D/g, "");
      return digits.length === 14 || digits.length === 11;
    }, "Quantidade de dígitos inválido"),
    telefone: z
      .string({ error: () => "Telefone obrigatório" })
      .refine(
        (e) => e.replace(/\D/g, "").length === 11,
        "Telefone deve ter 11 dígitos",
      ),
    cep: z
      .string({ error: () => "CEP obrigatório" })
      .refine((e) => e.length >= 8, "Quantidade de dígitos inválido"),
    endereco: z
      .string({ error: () => "Endereço obrigatório" })
      .min(1, "Endereço obrigatório"),
    numero: z
      .string({ error: () => "Número obrigatório" })
      .min(1, "Número obrigatório"),
    bairro: z
      .string({ error: () => "Bairro obrigatório" })
      .min(1, "Bairro obrigatório"),
    cidade: z
      .string({ error: () => "Cidade obrigatória" })
      .min(1, "Cidade obrigatória"), //should we use a external api to feed our selects?
    estado: z
      .string({ error: () => "Estado obrigatório" })
      .min(1, "Estado obrigatório"),
    ie: z.string().max(14, "IE não deve conter mais que 14 dígitos").optional(),
    isento: z.boolean().optional(),
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
