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
            
            return reply.status(200).send(result);
        } 
        catch (error) {
            request.log.error(error);
            return reply.status(500).send({ error });
        }
    }

    async createUserHandler(
        request: FastifyRequest,
        reply: FastifyReply
    ) {
        try {
            const result = await userService.createUser(request.body);
            
            return reply.status(201).send(result[0]);
        } 
        catch (error) {
            request.log.error(error);
            return reply.status(500).send({ error });
        }
    }
    
    async getUserHandler(
        request: FastifyRequest,
        reply: FastifyReply
    ) {
        try {
            const { id } = request.params;
            const result = await userService.getUser(id);

            return reply.status(200).send(result[0]);
        } 
        catch (error) {
            request.log.error(error);
            return reply.status(500).send({ error });
        }
    }
    
    async updateUserHandler(
        request: FastifyRequest,
        reply: FastifyReply
    ) {
        try {
            const { id } = request.params;
            const result = await userService.updateUser(id, request.body);

            return reply.status(200).send(result[0]);
        } 
        catch (error) {
            request.log.error(error);
            return reply.status(500).send({ error });
        }
    }

    async deleteUserHandler(
        request: FastifyRequest,
        reply: FastifyReply
    ) {
        try {
            const { id } = request.params;
            await userService.deleteUser(id);

            return reply.status(204).send();
        } 
        catch (error) {
            request.log.error(error);
            return reply.status(500).send({ error });
        }
    }

}

export default new UsersController(); 