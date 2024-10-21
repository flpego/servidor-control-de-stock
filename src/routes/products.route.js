import { Router } from "express";
import ProductController from "../controllers/products.controller.js";

const router = Router();
const productsController = new ProductController();


router.get("/", (req, res) => productsController.getAllProducts(req, res));
router.post("/add", (req, res) => productsController.addNewProduct(req, res));

router.route('/:id').
    get((req, res) => productsController.getProductById(req, res))
    .put((req, res) => productsController.updateProduct(req, res))
    .delete((req, res) => productsController.deleteProduct(req, res));



export default router;