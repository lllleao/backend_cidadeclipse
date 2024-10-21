import express from "express"
import bcrypt from 'bcrypt'
import { PrismaClient } from "@prisma/client"
import { validationResult } from "express-validator"
import { check } from "express-validator"

const router = express.Router()

const prisma = new PrismaClient()


const loginValidatorSign = [
    check('email', 'Por favor, forneça um email válido').isEmail().trim(),
    check('name', 'Por favor, forneça um nome válido').notEmpty().trim().escape(),
    check('password', 'Senha é obrigatória').notEmpty()
]

router.post('/create', loginValidatorSign, async (req, res) => {
    const erros = validationResult(req)
    const { name, email, password } = req.body
    const token = req.cookies.token

    if (token) return res.status(400).json({msg: 'Cadastro já realizado'})
    
    if (!erros.isEmpty()) return res.status(400).json({ msg: 'Credenciais incorretas' })

    bcrypt.genSalt(10)
        .then(salt => bcrypt.hash(password, salt))
        .then(hashPassword => {
            return prisma.user.findUnique({
                where: { email }
            })
            .then(user => {
                if (user) {
                    return res.status(400).json({msg: 'Cadastro já realizado'})
                }
                
                return prisma.user.create({
                    data: {
                        email,
                        password: hashPassword,
                        name
                    }
                })
            })
        })
        .then(newUser => {
            if (newUser.id) {
                res.status(201).json({msg: newUser.email, userId: newUser.id, signUserExist: false})
            }
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({ msg: 'Erro no servidor, tente novamente' })
        })
})

export default router
