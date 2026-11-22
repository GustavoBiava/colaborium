import customerRepository, { CustomerError } from "./customers.repository";
import type { createCustomerDTO, updateCustomerDTO } from "./customers.schemas";

class CustomerService {
  private buildDuplicateMessage(
    duplicate: {
      cpf_cnpj_empresa: string;
      email: string;
      ie: string | null;
      cpf_representante: string;
    },
    customer: createCustomerDTO | updateCustomerDTO,
  ) {
    if (duplicate.cpf_cnpj_empresa === customer.cpf_cnpj_empresa)
      return "CNPJ já cadastrado";
    if (duplicate.email === customer.email) return "E-mail já cadastrado";
    if (customer.ie && duplicate.ie === customer.ie) return "IE já cadastrada";
    if (duplicate.cpf_representante === customer.cpf_representante)
      return "CPF do representante já cadastrado";

    return "Registro duplicado";
  }

  async getCustomers(page: number, limit: number | "all") {
    if (limit === "all") {
      const registers = await customerRepository.getAllCustomers();
      return {
        data: registers,
        pagination: {
          actual_page: page,
          limit_per_page: limit,
          total: registers.length,
          total_pages: 1,
          has_next: false,
        },
      };
    }

    const offset = (page - 1) * limit;

    const [registers, totalRegisters] = await Promise.all([
      customerRepository.getCustomersPaginated(limit, offset),
      customerRepository.countTotal(),
    ]);

    const totalPages = Math.ceil(totalRegisters / limit);

    return {
      data: registers,
      pagination: {
        actual_page: page,
        limit_per_page: limit,
        total: totalRegisters,
        total_pages: totalPages,
        has_next: page < totalPages,
      },
    };
  }

  async createCustomer(customer: createCustomerDTO) {
    const duplicate = await customerRepository.findDuplicate(customer);

    if (duplicate) {
      throw new CustomerError(
        409,
        this.buildDuplicateMessage(duplicate, customer),
      );
    }

    const result = customerRepository.createCustomer(customer);
    return result;
  }

  async getCustomer(id: number) {
    const result = customerRepository.getCustomer(id);
    return result;
  }

  async updateCustomer(id: number, user: updateCustomerDTO) {
    const duplicate = await customerRepository.findDuplicate(user, id);

    if (duplicate) {
      throw new CustomerError(409, this.buildDuplicateMessage(duplicate, user));
    }

    const result = customerRepository.updateUser(id, user);
    return result;
  }

  async updateCustomerActive(id: number, ativo: boolean) {
    const result = customerRepository.updateCustomerActive(id, ativo);
    return result;
  }
}

export default new CustomerService();
