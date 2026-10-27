import { db } from "../../config/database";
import type { createCustomerDTO, updateCustomerDTO } from "./customers.schemas";

class CustomerRepository {

    async getCustomersPaginated(limit: number, offset: number) {
        const query = 'SELECT * FROM cliente ORDER BY id ASC LIMIT $1 OFFSET $2';
        const result = await db.query(query, [limit, offset]);
        return result.rows;
    }

    async createCustomer(customer: createCustomerDTO) {
        const result = await db.query(
            `INSERT INTO public.cliente(
                nome, cnpj_cpf, email, telefone, endereco, bairro, cidade, estado, cep, ativo, ie)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
            RETURNING id`,
            [
                customer.nome,
                customer.cnpj_cpf,
                customer.email,
                customer.telefone,
                customer.endereco,
                customer.bairro,
                customer.cidade,
                customer.estado,
                customer.cep,
                true,
                customer.ie
            ]
        );
        
        return result.rows;
    }

    async getCustomer(id: number) {
        const query = 'SELECT * FROM cliente WHERE id = $1';
        const result = await db.query(query, [ id ]);
        return result.rows;
    }

    async updateUser(id: number, user: updateCustomerDTO) {
        const result = await db.query(
            `UPDATE usuario SET
                nome = $1,
                email = $2,
                senha_hash = $3,
                perfil = $4,
                ativo = $5
            WHERE id = $6
            RETURNING id`,
            [
                user.nome,
                user.email,
                user.senha,
                user.perfil,
                user.ativo,
                id
            ]
        );
        
        return result.rows;
    }

    async deleteUser(id: number) {
        await db.query( `DELETE FROM usuario WHERE id = $1`, [ id ]);
    }

    async countTotal() {
        const query = 'SELECT COUNT(*) FROM usuario';
        const result = await db.query(query);
        return parseInt(result.rows[0].count, 10);
    }

}

export default new CustomerRepository();