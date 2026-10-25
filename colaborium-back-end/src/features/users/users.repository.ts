import { db } from "../../config/database";

class UserRepository {

    async getUsersPaginated(limit: number, offset: number) {
        const query = 'SELECT * FROM usuario ORDER BY id ASC LIMIT $1 OFFSET $2';
        const result = await db.query(query, [limit, offset]);
        return result.rows;
    }

    async countTotal() {
        const query = 'SELECT COUNT(*) FROM usuario';
        const result = await db.query(query);
        return parseInt(result.rows[0].count, 10);
    }

}

export default new UserRepository();