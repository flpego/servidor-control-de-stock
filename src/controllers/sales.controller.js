import SaleModel from "../models/sales.model.js";
import { handleError } from "../utils/handleErrors.js";

const saleModel = new SaleModel();


class SaleController {

    async getSales(req, res) {
        try {
            const result = await saleModel.getSales();
            console.log(result);
            return res.json(result);

        } catch (error) {
            handleError(res, error, "Error al iniciar sesión");
        };
    };


    async registerSale(req, res) {
        try {
            const { total_amount, payment_method, items } = req.body;
            const result = await saleModel.registerSale({ total_amount, payment_method, items });
            res.status(201).json({
                msg: "venta registrada",
                data: result
            });
        } catch (error) {
            handleError(res, error, "error al resgistrar venta")
        }

    }
}

export default SaleController;