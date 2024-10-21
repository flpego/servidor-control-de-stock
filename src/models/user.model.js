import db from '../database/connection.database.js';

class UserModel {
    constructor() { };

    async getUsers() {
        const query = "SELECT * FROM users"
        try {
            const { rows } = await db.query(query)
            return rows;
        } catch (error) {
            throw new Error('Error al buscar usuarios: ' + error.message);

        }
    }

    async createUser({ email, password, username, role }) {
        const query = {
            text: `INSERT INTO users (email, password, username, role)
            VALUES ($1, $2, $3, $4)
            RETURNING email`,
            values: [email, password, username, role]
        };
        try {
            const { rows } = await db.query(query);
            return rows[0];
        } catch (error) {
            throw new Error('Error al insertar usuario: ' + error.message);
        }
    }

    async findUserByEmail(email) {
        const query = {
            text: `
            SELECT * FROM users WHERE email = $1
            `,
            values: [email]
        };
        try {
            const { rows } = await db.query(query);
            return rows[0];
        } catch (error) {
            throw new Error('Error al buscar usuario: ' + error.message);
        };
    };

}

export default UserModel;

