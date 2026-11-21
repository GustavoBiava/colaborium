
import { db } from "../../config/database";
import type { createCustomerDTO, updateCustomerDTO } from "./customers.schemas";

class CustomerRepository {

    async getCustomersPaginated(limit: number, offset: number) {
        const query = `
            SELECT *
            FROM public.cliente
            ORDER BY id ASC
            LIMIT $1 OFFSET $2
        `;

        const result = await db.query(query, [limit, offset]);
        return result.rows;
    }

    async createCustomer(customer: createCustomerDTO) {
        const result = await db.query(
            `INSERT INTO public.cliente (
                nome_empresa,
                cpf_cnpj_empresa,
                ie,
                email,
                telefone,
                endereco_empresa,
                numero_empresa,
                complemento_empresa,
                bairro_empresa,
                cidade_empresa,
                estado_empresa,
                cep_empresa,
                nome_representante,
                cpf_representante,
                nacionalidade_representante,
                estado_civil_representante,
                cargo_representante,
                endereco_representante,
                numero_representante,
                complemento_representante,
                bairro_representante,
                cidade_representante,
                estado_representante,
                cep_representante,
                ativo
            )
            VALUES (
                $1, $2, $3, $4, $5,
                $6, $7, $8, $9, $10, $11, $12,
                $13, $14, $15, $16, $17,
                $18, $19, $20, $21, $22, $23, $24,
                $25
            )
            RETURNING id`,
            [
                customer.nome_empresa,
                customer.cpf_cnpj_empresa,
                customer.ie,
                customer.email,
                customer.telefone,
                customer.endereco_empresa,
                customer.numero_empresa,
                customer.complemento_empresa ?? null,
                customer.bairro_empresa,
                customer.cidade_empresa,
                customer.estado_empresa,
                customer.cep_empresa,
                customer.nome_representante,
                customer.cpf_representante,
                customer.nacionalidade_representante ?? null,
                customer.estado_civil_representante,
                customer.cargo_representante,
                customer.endereco_representante,
                customer.numero_representante,
                customer.complemento_representante ?? null,
                customer.bairro_representante,
                customer.cidade_representante,
                customer.estado_representante,
                customer.cep_representante,
                true
            ]
        );

        return result.rows;
    }

    async getCustomer(id: number) {
        const query = `
            SELECT *
            FROM public.cliente
            WHERE id = $1
        `;

        const result = await db.query(query, [id]);
        return result.rows;
    }

    async updateUser(id: number, customer: updateCustomerDTO) {
        const result = await db.query(
            `UPDATE public.cliente
            SET
                nome_empresa = $1,
                cpf_cnpj_empresa = $2,
                ie = $3,
                email = $4,
                telefone = $5,
                endereco_empresa = $6,
                numero_empresa = $7,
                complemento_empresa = $8,
                bairro_empresa = $9,
                cidade_empresa = $10,
                estado_empresa = $11,
                cep_empresa = $12,
                nome_representante = $13,
                cpf_representante = $14,
                nacionalidade_representante = $15,
                estado_civil_representante = $16,
                cargo_representante = $17,
                endereco_representante = $18,
                numero_representante = $19,
                complemento_representante = $20,
                bairro_representante = $21,
                cidade_representante = $22,
                estado_representante = $23,
                cep_representante = $24,
                ativo = $25
            WHERE id = $26
            RETURNING id`,
            [
                customer.nome_empresa,
                customer.cpf_cnpj_empresa,
                customer.ie,
                customer.email,
                customer.telefone,
                customer.endereco_empresa,
                customer.numero_empresa,
                customer.complemento_empresa ?? null,
                customer.bairro_empresa,
                customer.cidade_empresa,
                customer.estado_empresa,
                customer.cep_empresa,
                customer.nome_representante,
                customer.cpf_representante,
                customer.nacionalidade_representante ?? null,
                customer.estado_civil_representante,
                customer.cargo_representante,
                customer.endereco_representante,
                customer.numero_representante,
                customer.complemento_representante ?? null,
                customer.bairro_representante,
                customer.cidade_representante,
                customer.estado_representante,
                customer.cep_representante,
                customer.ativo,
                id
            ]
        );

        return result.rows;
    }

    async updateCustomerActive(id: number, ativo: boolean) {
        const result = await db.query(
            `UPDATE public.cliente
            SET ativo = $1
            WHERE id = $2
            RETURNING id`,
            [ativo, id]
        );

        return result.rows;
    }

    async countTotal() {
        const query = 'SELECT COUNT(*) FROM public.cliente';
        const result = await db.query(query);
        return parseInt(result.rows[0].count, 10);
    }

}

export default new CustomerRepository();
