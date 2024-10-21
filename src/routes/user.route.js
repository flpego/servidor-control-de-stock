import { Router } from "express";
import UserController from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/jwt.middleware.js";
import {  validateLoginFields, validateRegisterFields } from "../middlewares/fieldsValidator.middleware.js";

const router = Router();
const userController = new UserController();

router.get("/", (req, res) => userController.getUsers(req, res));
router.post("/register", validateRegisterFields ,(req, res) => userController.registerNewUser(req, res));
router.post("/login", validateLoginFields,(req, res) => userController.loginUser(req, res));
router.get("/profile", verifyJWT ,(req, res) => userController.isProfile(req, res));


export default router;