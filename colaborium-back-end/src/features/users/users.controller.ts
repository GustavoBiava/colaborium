import { FastifyRequest, FastifyReply } from 'fastify';
import userService from "./users.service";

class UsersController {

    async getUsersHandler(
        request: FastifyRequest,
        reply: FastifyReply
    ) {
        try {
            const page = request.query.page;
            const limit = request.query.limit;

            const result = await userService.getUsers(page, limit);
            
            return reply.send(result);
        } 
        catch (error) {
            request.log.error(error);
            return reply.status(500).send({ error });
        }
    }

}

export default new UsersController(); 