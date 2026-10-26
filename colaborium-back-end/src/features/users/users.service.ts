import usersRepository from "./users.repository";
import type { createUserDTO, updateUserDTO } from "./users.schemas";

class UserService {

    async getUsers(page: number, limit: number) {
        const offset = (page - 1) * limit;

        const [registers, totalRegisters] = await Promise.all([
            usersRepository.getUsersPaginated(limit, offset),
            usersRepository.countTotal()
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

    async createUser(user: createUserDTO) {
        const result = usersRepository.createUser(user);
        return result;
    }

    async updateUser(id: number, user: updateUserDTO) {
        const result = usersRepository.updateUser(id, user);
        return result;
    }

}

export default new UserService();