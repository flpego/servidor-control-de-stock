import db from "../database/connection.database.js"

class SaleModel {
    async getSales(){
        const query = "SELECT * FROM sales"
        try {
            const { rows } = await db.query(query)
            return rows;
        } catch (error) {
            throw new Error('Error al buscar ventas: ' + error.message);

        }
    }
    async registerSale({ total_amount, payment_method, items }) {
        try {
            // Iniciar una transacción
            await db.query('BEGIN');
            //Verificar si hay stock
            for (const item of items) {
                const productResult = await db.query('SELECT stock FROM products WHERE product_id = $1', [item.product_id]);
                const product = productResult.rows[0];

                if (!product || product.stock < item.quantity) {
                    throw new Error(`No hay suficiente stock para el producto con ID ${item.product_id}`);
                }
            }

            // Insertar la venta
            const saleResult = await db.query('INSERT INTO sales (total_amount, payment_method) VALUES ($1, $2) RETURNING sale_id', [total_amount, payment_method]);
            const saleId = saleResult.rows[0].sale_id;

            // Insertar los productos vendidos
            for (const item of items) {
                await db.query('INSERT INTO sale_items (sale_id, product_id, quantity, price_at_sale) VALUES ($1, $2, $3, (SELECT price FROM products WHERE product_id = $2))', [saleId, item.product_id, item.quantity]);

                // Actualizar el stock
                await db.query('UPDATE products SET stock = stock - $1 WHERE product_id = $2', [item.quantity, item.product_id]);
            }

            // Confirmar la transacción
            await db.query('COMMIT');

            res.status(201).json({ ok: true, message: 'Venta registrada en la bd' });
        } catch (error) {
            await db.query('ROLLBACK');
            res.status(500).json({ error: 'Error al registrar la venta: ' + error.message });
        }

    }
};

export default SaleModel;

