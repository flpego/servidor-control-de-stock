import db from "../database/connection.database.js"

class SaleModel {
    constructor() { };
    async getSales() {
        const query = `
        SELECT sales.sale_id, sales.sale_date, sales.total_amount, sales.payment_method,
        sale_items.product_id, sale_items.quantity, products.name as product_name
        FROM sales
        LEFT JOIN sale_items ON sales.sale_id = sale_items.sale_id
        LEFT JOIN products ON sale_items.product_id = products.product_id`;
        try {
            const { rows } = await db.query(query);
        
            // Estructura los datos para incluir los items de cada venta
            const salesMap = {};
    
            rows.forEach(row => {
                // Si la venta ya existe en el mapa, añade el item
                if (salesMap[row.sale_id]) {
                    salesMap[row.sale_id].items.push({
                        product_id: row.product_id,
                        quantity: row.quantity,
                        product_name: row.product_name,
                    });
                } else {
                    // Si la venta no existe, crea un nuevo objeto de venta
                    salesMap[row.sale_id] = {
                        sale_id: row.sale_id,
                        sale_date: row.sale_date,
                        total_amount: row.total_amount,
                        payment_method: row.payment_method,
                        items: [{
                            product_id: row.product_id,
                            quantity: row.quantity,
                            product_name: row.product_name,
                        }],
                    };
                }
            });
    
            // Convierte el mapa de ventas en un array
            return Object.values(salesMap);
        } catch (error) {
            throw new Error('Error al buscar ventas: ' + error.message);
        }
    };

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
                await db.query(
                    'INSERT INTO sale_items (sale_id, product_id, quantity, price_at_sale) VALUES ($1, $2, $3, (SELECT price FROM products WHERE product_id = $2))',
                    [saleId, item.product_id, item.quantity]
                );

                // Actualizar el stock
                await db.query('UPDATE products SET stock = stock - $1 WHERE product_id = $2', [item.quantity, item.product_id]);
            }

            // Confirmar la transacción
            await db.query('COMMIT');
            const saleItemsDetail = await db.query(`
                SELECT p.name AS product_name, si.quantity
                FROM sale_items si
                JOIN products p ON si.product_id = p.product_id
                WHERE si.sale_id = $1
            `, [saleId]);
            return {
                ok: true,
                message: 'Venta registrada en la bd',
                sale: {
                    sale_id: saleId,
                    total_amount,
                    payment_method,
                    sale_date: new Date(),
                    items: saleItemsDetail.rows // Detalle de los productos
                }
            };
        } catch (error) {
            await db.query('ROLLBACK');
            res.status(500).json({ error: 'Error al registrar la venta: ' + error.message });
        }

    }
};

export default SaleModel;

