import db from '../database/connection.database.js';

class ProductModel {
    constructor() { };
    //helper funtion
    async executeQuery(query) {
        try {
            const { rows } = await db.query(query);
            return rows;
        } catch (error) {
            throw new Error('Database error: ' + error.message);
        };
    };
    //Read
    async getProducts() {
        const query = "SELECT * FROM products";
        return this.executeQuery(query);
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
        const [product] = await this.executeQuery(query);
        return product;
    };

    //read
    async getProductByName(name) {
        const query = {
            text: `
            SELECT * FROM products WHERE name = $1
            `,
            values: [name]
        };
        const [product] = await this.executeQuery(query);
        return product;
    };

    async getProductById(id) {
        const query = {
            text: `
            SELECT * FROM products WHERE product_id = $1
            `,
            values: [id]
        };
        const [product] = await this.executeQuery(query);
        return product;
    };

    //put
    async updateProduct(id, { name, description, price, stock, category, supplier, min_stock }) {
        const query = {
            text: `
            UPDATE products
            SET name = $1, description = $2, price = $3, stock = $4, category = $5, supplier = $6, min_stock = $7
            WHERE product_id = $8
            RETURNING name
            `,
            values: [name, description, price, stock, category, supplier, min_stock, id]
        };
        const [updatedProduct] = await this.executeQuery(query);
        return updatedProduct;

    };
    //delete
    async deleteProduct(id) {
        const query = {
            text: `
            DELETE FROM products WHERE product_id = $1 RETURNING *`,
            values: [id]
        };
        const [deletedProduct] = await this.executeQuery(query);
        return deletedProduct;
    };


};

export default ProductModel;