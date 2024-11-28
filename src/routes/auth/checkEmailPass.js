import { check } from "express-validator"

export const loginValidatorLogin = [
    check('email', 'Por favor, forneça um email válido').isEmail().trim(),
    check('password', 'Senha é obrigatória').notEmpty()
]
