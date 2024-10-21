import ProductModel from "../models/prodcuts.model.js";
import { handleError } from "../utils/handleErrors.js";
const productsModel = new ProductModel();

class ProductController {
    constructor() { }

    async getAllProducts(req, res) {
        try {
            const result = await productsModel.getProducts();
            console.log(result);
            res.json(result);
        } catch (error) {
            handleError(res, error, "Error al obtener todos los productos");
        };
    };

    async addNewProduct(req, res) {
        try {
            const { name, description, price, stock, category, supplier, min_stock } = req.body;
            if (!name || !price || !stock) {
                return res.status(400).json({ msg: "Los campos 'name', 'price' y 'stock' son obligatorios" });
            }

            const productExist = await productsModel.findProductByName(name);
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

    async getProductById(req, res) {
        try {
            const { id} = req.params;
            const product = await productsModel.findProductById(id);
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

    async deleteProduct(req, res){
        try {
            const {id} =req.params;
            const deleteProduct = await productsModel.deleteProduct(id);
            if(!deleteProduct){ return res.status(404).json({msg: "Producto no encontrado"})};
            
            return res.status(200).json({
                msg: "Producto eliminado con exito",
                data: deleteProduct
            })
            
        } catch (error) {
            handleError(res, error, "Error al borrar producto");
            
        }
    }
}


export default ProductController;