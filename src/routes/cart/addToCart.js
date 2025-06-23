import express from 'express'
import { PrismaClient } from '@prisma/client'
import { validationResult } from 'express-validator'
import authMiddToken from '../auth/authToken.js'

const router = express.Router()
const prisma = new PrismaClient()

router.post('/addCart', authMiddToken, (req, res) => {
    const { photo, price, quant, name } = req.body

    const userId = req.user

    const token = req.cookies
    if (!token)
        return res.status(401).json({ msg: 'Requisição não autorizada' })

    prisma.cart.findUnique({
            where: {
                userId
            }
        }).then((cart) => {
            prisma.item.findMany({
                where: {
                    cartId: cart.id
                }
            }).then((itemsCart) => {
                console.log(itemsCart)
                prisma.item.create(
                    {
                        data: {
                            cartId: cart.id,
                            userId,
                            name,
                            photo,
                            price,
                            quant
                        }
                    }).then((item) => {
                        prisma.item
                            .aggregate({
                                _sum: {
                                    price: true
                                },
                                where: {
                                    cartId: item.cartId
                                }
                            })
                            .then((totalPrice) => {
                                prisma.cart
                                    .update({
                                        where: { id: item.cartId },
                                        data: {
                                            totalPrice:
                                                totalPrice._sum.price || 0
                                        }
                                    })
                                    .catch((err) => {
                                        console.log(err)
                                        return res
                                            .status(401)
                                            .json({
                                                msg: 'Preço não atualizado'
                                            })
                                    })
                            })
                            .catch((err) => {
                                console.log(err)
                                return res
                                    .status(401)
                                    .json({ msg: 'Preço não somado' })
                            })
                    }).catch((err) => {
                        console.log(err, 'Item não criado')
                        return res.status(401).json({ msg: 'não criado' })
                    })
            }).catch((err) => {
                console.log(err, 'Itens não encontrados')
                return res.status(401).json({ msg: 'não criado' })
            })
        }).catch((err) => {
            console.error('Carrinho não encontrado', err)
            return res.status(500).json({ msg: 'Carrinho não encontrado' })
        })
})

export default router
