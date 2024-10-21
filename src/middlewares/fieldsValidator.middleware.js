import { check, validationResult } from 'express-validator';

// Validación para el login de usuario
export const validateLoginFields = [
    check('email')
        .isEmail().withMessage('El email debe ser válido')
        .notEmpty().withMessage('El campo email es requerido'),

    check('password')
        .isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres')
        .notEmpty().withMessage('El campo contraseña es requerido'),

    // Manejo de errores de validación
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                ok: false,
                errors: errors.array().map(error => error.msg)  
            });
        }
        next();
    }
];

export const validateRegisterFields = [

    check('username', 'El nombre de usuario es requerido').not().isEmpty(),


    check('email')
        .isEmail().withMessage('El email debe ser valido')
        .notEmpty().withMessage('El campo email es requerido'),

    check('password')
        .isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres')
        .notEmpty().withMessage('El campo contraseña es requerido'),

    check('role', 'El rol es obligatorio').not().isEmpty(),


    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                ok: false,
                errors: errors.array().map(error => error.msg)  
            });
        }
        next();
    }

]
