import express from "express"
import bcrypt from 'bcrypt'
import { PrismaClient } from "@prisma/client"
import { validationResult } from "express-validator"
import { check } from "express-validator"
import { generateJWTToken } from "../../tokenService/index.js"
import sendEmailVerified from "../../emailService/index.js"

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
    const tokenLogado = req.cookies.token

    if (tokenLogado) return res.status(400).json({msg: 'Cadastro já realizado'})
    
    if (!erros.isEmpty()) return res.status(400).json({ msg: 'Credenciais incorretas' })

    

    bcrypt.genSalt(10)
        .then(salt => bcrypt.hash(password, salt))
        .then(hashPassword => {
            prisma.user.findUnique({
                where: { email }
            })
            .then(user => {
                if (user) {
                    return res.status(400).json({msg: user.email, userId: user.id, signUserExist: false})
                }

                return prisma.user.create({
                    data: {
                        email,
                        password: hashPassword,
                        name,
                        isVerified: false
                    }
                }).then(user => {
                    prisma.cart.create({
                        data: {
                            totalPrice: 0,
                            userId: user.id,
                        }
                    }).catch(err => {
                        console.log(err)
                        return res.status(400).json({msg: 'Carrinho não criado'})
                    })

                    return generateJWTToken(user)
                        .then(token => {

                            prisma.user.update({
                                where: { id: user.id },
                                data: {
                                    token
                                }
                            }).then(() => {
                                res.status(201).json({msg: 'deu bom', signSuccess: true})
                                return sendEmailVerified(user.email, user.id, token)
                            }).catch(err => console.log('Erro ao atualizar o usuário', err))
                        }).catch(err => console.log('Token não gerado', err))
                })
            })
        }).catch(err => {
            console.log(err)
            res.status(500).json({ msg: 'Erro no servidor, tente novamente' })
        })
})

export default router
