import usersRepository from "./users.repository";

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

}

export default new UserService();