import bcrypt from "bcryptjs";
import authRepository from "./auth.repository.js";
import type { LoginDTO } from "./auth.schemas.js";

class AuthService {
    async validateCredentials({ email, senha }: LoginDTO) {
        const user = await authRepository.findByEmail(
            email.trim().toLowerCase()
        );

        if (!user || !user.ativo) {
            return null;
        }

        const passwordMatches = await bcrypt
            .compare(senha, user.senha_hash)
            .catch(() => false);

        if (!passwordMatches) {
            return null;
        }

        return {
            id: user.id,
            nome: user.nome,
            email: user.email,
            perfil: user.perfil,
        };
    }

    async getUser(id: number) {
        return authRepository.findPublicById(id);
    }
    
    async registerLogin(id: number) {
    await authRepository.updateLastLogin(id);
    }
}

export default new AuthService();