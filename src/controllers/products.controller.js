import ProductModel from "../models/prodcuts.model.js";
import { handleError } from "../utils/handleErrors.js";
const productsModel = new ProductModel();

class ProductController {
    constructor() { }
    //GET
    async getAllProducts(req, res) {
        try {
            const result = await productsModel.getProducts();
            console.log(result);
            res.json(result);
        } catch (error) {
            handleError(res, error, "Error al obtener todos los productos");
        };
    };
    //GET
    async getProductById(req, res) {
        try {
            const { id } = req.params;
            const product = await productsModel.getProductById(id);
            console.log(id)
            if (!product) { return res.status(404).json({ msg: "Producto no encontrado" }) };

            res.status(200).json({
                ok: true,
                data: product
            });

        } catch (error) {
            handleError(res, error, "Error al obtener producto");
        };
    };
    //POST
    async addNewProduct(req, res) {
        try {
            const { name, description, price, stock, category, supplier, min_stock } = req.body;
            if (!name || !price || !stock) {
                return res.status(400).json({ msg: "Los campos 'name', 'price' y 'stock' son obligatorios" });
            }

            const productExist = await productsModel.getProductByName(name);
            if (productExist) { return res.status(409).json({ msg: "El producto ya existe" }) };
            const result = await productsModel.addNewProduct({ name, description, price, stock, category, supplier, min_stock });
            res.status(200).json({
                ok: true,
                data: result
            });

        } catch (error) {
            handleError(res, error, "Error al agregar producto");
        };
    };

    //DELETE
    async deleteProduct(req, res) {
        try {
            const { id } = req.params;
            console.log("ID recibido para eliminar:", id);
            const deleteProduct = await productsModel.deleteProduct(id);
            if (!deleteProduct) { return res.status(404).json({ msg: "Producto no encontrado" }) };

            return res.status(200).json({
                msg: "Producto eliminado con exito",
                data: deleteProduct
            })

        } catch (error) {
            console.error("Error al eliminar producto:", error);  
            return   handleError(res, error, "Error al eliminar producto");

        }
    }
    //PUT
    async updateProduct(req, res) {
        try {
            const { id } = req.params
            const { name, description, price, stock, category, supplier, min_stock } = req.body;
            const productExist = await productsModel.getProductById(id);
            if (!productExist) { return res.status(404).json({ msg: "Producto no encontrado" }) };

            const result = await productsModel.updateProduct(id, { name, description, price, stock, category, supplier, min_stock });

            res.status(200).json({
                msg: "Producto actualizado",
                data: result
            });

        } catch (error) {
            handleError(res, error, "Error al actualizar producto");

        }
    }
}


export default ProductController;