import type { FastifyReply, FastifyRequest } from "fastify";
import authService from "./auth.service.js";
import type { LoginDTO } from "./auth.schemas.js";

class AuthController {
    async loginHandler(
        request: FastifyRequest<{ Body: LoginDTO }>,
        reply: FastifyReply
    ) {
        try {
            const user = await authService.validateCredentials(request.body);

            if (!user) {
                return reply
                    .status(401)
                    .send({ message: "E-mail ou senha inválidos." });
            }

            try {
                await authService.registerLogin(user.id);
            } catch (error) {
                request.log.error(error);
            }

            const accessToken = await reply.jwtSign({
                sub: String(user.id),
                perfil: user.perfil,
            });

            return reply.send({ accessToken, user });

        } catch (error) {
            request.log.error(error);
            return reply.status(500).send({ message: "Erro ao autenticar." });
        }
    }

    async meHandler(request: FastifyRequest, reply: FastifyReply) {
        const user = await authService.getUser(Number(request.user.sub));

        if (!user || !user.ativo) {
            return reply.status(401).send({ message: "Não autenticado." });
        }

        return reply.send({ user });
    }
}

export default new AuthController();