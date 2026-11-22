import { db } from "../../config/database";

type AuthUserRow = {
    id: number;
    nome: string;
    email: string;
    senha_hash: string;
    perfil: "USUARIO" | "ADMIN";
    ativo: boolean;
};

class AuthRepository {
    async findByEmail(email: string): Promise<AuthUserRow | null> {
        const result = await db.query<AuthUserRow>(
            `SELECT id, nome, email, senha_hash, perfil, ativo
        FROM usuario
        WHERE email = $1
        LIMIT 1`,
            [email]
        );

        return result.rows[0] ?? null;
    }

    async findPublicById(id: number) {
        const result = await db.query(
            `SELECT id, nome, email, perfil, ativo
        FROM usuario
        WHERE id = $1
        LIMIT 1`,
            [id]
        );

        return result.rows[0] ?? null;
    }

    async updateLastLogin(id: number): Promise<void> {
        await db.query(
            `UPDATE usuario
        SET ultimo_login = NOW()
        WHERE id = $1`,
            [id]
        );
    }
}

export default new AuthRepository();