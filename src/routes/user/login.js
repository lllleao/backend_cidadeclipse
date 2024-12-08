import express from "express"
import bcrypt from 'bcrypt'
import { PrismaClient } from "@prisma/client"
import jwt from "jsonwebtoken"
import { validationResult, body } from "express-validator"

const router = express.Router()
const prisma = new PrismaClient()
const JWT_SECRET = process.env.JWT_SECRET

const loginValidatorLogin = [
    body('email').isEmail().trim().notEmpty().withMessage('Por favor, forneça um email válido'),
    body('password').notEmpty().withMessage('Senha é obrigatória')
]

router.post('/login', loginValidatorLogin, (req, res) => {
    const erros = validationResult(req)
    const token = req.cookies.token

    if (token) return res.status(400).json({msg: 'Login já realizado'})
    
    const { email, password } = req.body
    if (!erros.isEmpty()) return res.status(400).json({ erros: erros.array() })

    prisma.user.findUnique({
        where: {
            email
        }
    }).then(user => {
        if (!user.isVerified) {
            return res.status(401).json({msg: 'Email não verificado'})
        }
        bcrypt.compare(password, user.password).then(validPass => {
            if (!validPass) {

                return res.json({ msg: 'Senha não encontrada', loginUserExist: false, passWordCorrect: true, loginSuccess: false })
            }

            const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '1h' })

            res.cookie('token', token, {
                path: '/',
                httpOnly: true,
                sameSite: 'none',
                maxAge: 3600000,
                secure: true
            })
            return res.status(201).json({passWordCorrect: false, msg: email, loginUserExist: false, loginSuccess: true})

        })
    }).catch((err) => {
        console.log(err)
        return res.status(404).json({ msg: 'Email incorreto' })
    })
})

export default router
