import { db } from "../../config/database.js";
import type { createUserDTO, updateUserDTO } from "./users.schemas.js";
import bcrypt from "bcryptjs";

class UserRepository {

    async getUsersPaginated(limit: number, offset: number) {
        const query = 'SELECT id, nome, email, perfil, ativo FROM usuario ORDER BY id ASC LIMIT $1 OFFSET $2';
        const result = await db.query(query, [limit, offset]);
        return result.rows;
    }

    async createUser(user: createUserDTO) {
        const senhaHash = await bcrypt.hash(user.senha, 12);

        const result = await db.query(
            `INSERT INTO usuario(
                nome, email, senha_hash, perfil, ativo)
                VALUES ($1, $2, $3, $4, $5)
            RETURNING id`,
            [
                user.nome,
                user.email,
                senhaHash,
                user.perfil,
                true
            ]
        );
        
        return result.rows;
    }

    async getUser(id: number) {
        const query = 'SELECT id, nome, email, perfil, ativo FROM usuario FROM usuario WHERE id = $1';
        const result = await db.query(query, [ id ]);
        return result.rows;
    }

    async updateUser(id: number, user: updateUserDTO) {
        const senhaHash = user.senha ? await bcrypt.hash(user.senha, 12) : undefined;

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
                senhaHash,
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

export default new UserRepository();