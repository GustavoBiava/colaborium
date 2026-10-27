import { FastifyRequest, FastifyReply } from 'fastify';
import customerService from "./customers.service";

class CustomerController {

    async getCustomersHandler(
        request: FastifyRequest,
        reply: FastifyReply
    ) {
        try {
            const page = request.query.page;
            const limit = request.query.limit;

            const result = await customerService.getCustomers(page, limit);
            
            return reply.status(200).send(result);
        } 
        catch (error) {
            request.log.error(error);
            return reply.status(500).send({ error });
        }
    }

    async createCustomerHandler(
        request: FastifyRequest,
        reply: FastifyReply
    ) {
        try {
            const result = await customerService.createCustomer(request.body);
            
            return reply.status(201).send(result[0]);
        } 
        catch (error) {
            request.log.error(error);
            return reply.status(500).send({ error });
        }
    }
    
    async getCustomerHandler(
        request: FastifyRequest,
        reply: FastifyReply
    ) {
        try {
            const { id } = request.params;
            const result = await customerService.getCustomer(id);

            return reply.status(200).send(result[0]);
        } 
        catch (error) {
            request.log.error(error);
            return reply.status(500).send({ error });
        }
    }
    
    async updateCustomerHandler(
        request: FastifyRequest,
        reply: FastifyReply
    ) {
        try {
            const { id } = request.params;
            const result = await customerService.updateCustomer(id, request.body);

            return reply.status(200).send(result[0]);
        } 
        catch (error) {
            request.log.error(error);
            return reply.status(500).send({ error });
        }
    }

    async deleteCustomerHandler(
        request: FastifyRequest,
        reply: FastifyReply
    ) {
        try {
            const { id } = request.params;
            await customerService.deleteCustomer(id);

            return reply.status(204).send();
        } 
        catch (error) {
            request.log.error(error);
            return reply.status(500).send({ error });
        }
    }

}

export default new CustomerController(); 