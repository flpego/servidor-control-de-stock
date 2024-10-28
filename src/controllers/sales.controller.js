import SaleModel from "../models/sales.model.js";
import { handleError } from "../utils/handleErrors.js";

const saleModel = new SaleModel();


class SaleController {
    constructor(){};
    async getSales(req, res) {
        try {
            const result = await saleModel.getSales();
            console.log("Ventas obtenidas:", result);
            return res.json(result);  // Asegúrate de que la respuesta se envíe correctamente
        } catch (error) {
            console.error("Error en el controlador de ventas:", error.message);
            return res.status(500).json({ message: "Error al obtener las ventas" });
        }
    }

    async registerSale(req, res) {
        try {
            const saleData = req.body;
            const result = await saleModel.registerSale(saleData);
            res.status(201).json(result);
        } catch (error) {
            console.error("Error en registerSale:", error); // Log detallado
            handleError(res, error, "error al resgistrar venta")
        }

    }
}

export default SaleController;