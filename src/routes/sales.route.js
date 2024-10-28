import { Router } from "express";
import SaleController from "../controllers/sales.controller.js";

const router = Router();
const saleController = new SaleController();

router.get("/", (req, res) => { saleController.getSales(req, res) })
router.post("/register", (req, res) => { saleController.registerSale(req, res) })

export default router;