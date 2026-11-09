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

    async updateUser(id: number, customer: updateCustomerDTO) {
        const result = await db.query(
            `UPDATE cliente
                SET nome=$1,
                    cnpj_cpf=$2,
                    email=$3,
                    telefone=$4,
                    endereco=$5,
                    bairro=$6,
                    cidade=$7,
                    estado=$8,
                    cep=$9,
                    ativo=$10,
                    ie=$11
                WHERE id = $12
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
                customer.ativo,
                customer.ie,
                id
            ]
        );
        
        return result.rows;
    }

    async deleteCustomer(id: number) {
        await db.query( `DELETE FROM cliente WHERE id = $1`, [ id ]);
    }

    async countTotal() {
        const query = 'SELECT COUNT(*) FROM usuario';
        const result = await db.query(query);
        return parseInt(result.rows[0].count, 10);
    }

}

export default new CustomerRepository();