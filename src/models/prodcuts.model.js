import db from '../database/connection.database.js';

class ProductModel {
    constructor() { };
    //Read
    async getProducts() {
        try {
            const query = "SELECT * FROM products"
            const { rows } = await db.query(query);
            return rows;

        } catch (error) {
            throw new Error('Error al buscar productos: ' + error.message);
        }
    };
    //create
    async addNewProduct({ name, description, price, stock, category, supplier, min_stock }) {
        const query = {
            text: `
            INSERT INTO products (name, description, price, stock, category, supplier, min_stock)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING name
            `,
            values: [name, description, price, stock, category, supplier, min_stock]
        };
        try {
            const { rows } = await db.query(query);
            return rows[0];
        } catch (error) {
            throw new Error('Error al buscar productos: ' + error.message);

        }
    };
    
    //read
    async findProductByName(name) {
        const query = {
            text: `
            SELECT * FROM products WHERE name = $1
            `,
            values: [name]
        };
        try {
            const { rows } = await db.query(query);
            return rows[0];
        } catch (error) {
            throw new Error('Error al insertar producto en la base: ' + error.message);
        };
    };

     async findProductById(id) {
        const query = {
            text: `
            SELECT * FROM products WHERE product_id = $1
            `,
            values: [id]
        };
        try {
            const { rows } = await db.query(query);
            return rows[0];
        } catch (error) {
            throw new Error('Error al obtener producto en la base: ' + error.message);
        };
    };

    //put
    async updateProduct(id, { name, description, price, stock, category, supplier, min_stock }) {
        const query = {
            text: `
            UPDATE products
            SET name = $1, description = $2, price = $3, stock = $4, category = $5, supplier = $6, min_stock = $7
            WHERE id = $8
            RETURNING name
            `,
            values: [name, description, price, stock, category, supplier, min_stock, id]
        };
        try {
            const { rows } = await db.query(query);
            return rows[0];

        } catch (error) {
            throw new Error('Error al buscar productos: ' + error.message);

        }
    };
    //delete
    async deleteProduct(id) {
        const query = {
            text: `
            DELETE FROM products WHERE product_id = $1 RETURNING *`,
            values: [id]
        };
        try {
            const { rows } = await db.query(query);
            return rows[0];
        } catch (error) {
            throw new Error('Error al buscar productos: ' + error.message);

        };
    };

   
};

export default ProductModel;