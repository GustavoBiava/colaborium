import type { FastifyRequest, FastifyReply } from "fastify";
import type { createCustomerDTO, updateCustomerDTO } from "./customers.schemas";
import customerService from "./customers.service";

type CustomerQuery = {
  page: number;
  limit: number;
};

type CustomerParams = {
  id: number;
};

class CustomerController {
  async getCustomersHandler(
    request: FastifyRequest<{ Querystring: CustomerQuery }>,
    reply: FastifyReply,
  ) {
    try {
      const { page, limit } = request.query;

      const result = await customerService.getCustomers(page, limit);

      return reply.status(200).send(result);
    } catch (error) {
      request.log.error(error);
      return reply.status(500).send({ error });
    }
  }

  async createCustomerHandler(
    request: FastifyRequest<{ Body: createCustomerDTO }>,
    reply: FastifyReply,
  ) {
    try {
      const result = await customerService.createCustomer(request.body);

      return reply.status(201).send(result[0]);
    } catch (error) {
      request.log.error(error);
      return reply.status(500).send({ error });
    }
  }

  async getCustomerHandler(
    request: FastifyRequest<{ Params: CustomerParams }>,
    reply: FastifyReply,
  ) {
    try {
      const { id } = request.params;
      const result = await customerService.getCustomer(id);

      if (!result[0]) {
        return reply.status(404).send({ message: "Cliente não encontrado" });
      }

      return reply.status(200).send(result[0]);
    } catch (error) {
      request.log.error(error);
      return reply.status(500).send({ error });
    }
  }

  async updateCustomerHandler(
    request: FastifyRequest<{
      Params: CustomerParams;
      Body: updateCustomerDTO;
    }>,
    reply: FastifyReply,
  ) {
    try {
      const { id } = request.params;
      const result = await customerService.updateCustomer(id, request.body);

      if (!result[0]) {
        return reply.status(404).send({ message: "Cliente não encontrado" });
      }

      return reply.status(200).send(result[0]);
    } catch (error) {
      request.log.error(error);
      return reply.status(500).send({ error });
    }
  }

  async deleteCustomerHandler(
    request: FastifyRequest<{ Params: CustomerParams }>,
    reply: FastifyReply,
  ) {
    try {
      const { id } = request.params;
      await customerService.deleteCustomer(id);

      return reply.status(204).send();
    } catch (error) {
      request.log.error(error);
      return reply.status(500).send({ error });
    }
  }
}

export default new CustomerController();
