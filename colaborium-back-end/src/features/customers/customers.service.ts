import customerRepository from "./customers.repository";
import type { createCustomerDTO, updateCustomerDTO } from "./customers.schemas";

class CustomerService {

    async getCustomers(page: number, limit: number) {
        const offset = (page - 1) * limit;

        const [registers, totalRegisters] = await Promise.all([
            customerRepository.getCustomersPaginated(limit, offset),
            customerRepository.countTotal()
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
            }
        };
    }

    async createCustomer(customer: createCustomerDTO) {
        const result = customerRepository.createCustomer(customer);
        return result;
    }

    async getCustomer(id: number) {
        const result = customerRepository.getCustomer(id);
        return result;
    }

    async updateCustomer(id: number, user: updateCustomerDTO) {
        const result = customerRepository.updateUser(id, user);
        return result;
    }

    async deleteCustomer(id: number) {
        customerRepository.deleteCustomer(id);
    }

}

export default new CustomerService();