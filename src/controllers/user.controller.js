import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken'
import UserModel from '../models/user.model.js';
import { handleError } from '../utils/handleErrors.js';
const userModel = new UserModel();

class UserController {
    constructor() { };

    async getUsers(req, res) {
        try {
            const result = await userModel.getUsers();
            console.log(result);
            return res.json(result);

        } catch (error) {
            handleError(res, error, "Error al iniciar sesión");
        };
    };

    async registerNewUser(req, res) {
        try {
            const { username, email, password, role } = req.body;

            const user = await userModel.findUserByEmail(email);
            if (user) { return res.status(409).json({ msg: "El usuario ya existe" }) };

            //bcrypt
            const salt = await bcryptjs.genSalt(9);
            const hashedPass = await bcryptjs.hash(password, salt);
            const newUser = await userModel.createUser({ email, password: hashedPass, username, role });

            const token = jwt.sign({
                email: newUser.email
            },
                process.env.JWT_SR,
                {
                    expiresIn: "10m"
                }
            );

            return res.status(201).json({
                ok: true,
                msg: token

            });
        } catch (error) {
            handleError(res, error, "Error al iniciar sesión");
        };
    };

    async loginUser(req, res) {
        try {
            const { email, password } = req.body;
            const user = await userModel.findUserByEmail(email);

            if (!user) {
                res.status(400).json({ msg: "Usuarion no encontrado" });
            }
            //bcrypt
            const passMatch = bcryptjs.compare(password, user.password);
            if (!passMatch) {
                res.status(401).json({ msg: "pass not match" })
            }

            const token = jwt.sign({email: user.email},process.env.JWT_SR,{expiresIn: "45m"});
            //response
            return res.status(200).json({
                ok: true,
                msg: token

            });
        } catch (error) {
            handleError(res, error, "Error al iniciar sesión");
        };
    };

    async isProfile(req, res) {
        try {
            return res.json({
                ok: true
            })

        } catch (error) {
            handleError(res, error, "Error al iniciar sesión"); 
        }
    }

};

export default UserController;