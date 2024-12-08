import express from "express"
import { PrismaClient } from "@prisma/client"
import { validationResult } from "express-validator"
import authMiddToken from '../auth/authToken.js'

const router = express.Router()
const prisma = new PrismaClient()

router.post('/addCart', authMiddToken, (req, res) => {
    const { photo, price, quant, name, id } = req.body

    const userId = req.user
    const token = req.cookies
    if (!token) return res.status(401).json({msg: 'Requisição não autorizada'})

    prisma.cart.findUnique({
        where: {
            userId
        }
    }).then(cart => {
        prisma.item.create({
            data: {
                cartId: cart.id,
                userId,
                name,
                photo,
                price,
                quant,
                id: id
            }
        }).then(item => {
            prisma.item.aggregate({
                _sum: {
                    price: true
                },
                where: {
                    cartId: item.cartId
                }
            }).then(totalPrice => {
                prisma.cart.update({
                    where: {id: item.cartId},
                    data: {
                        totalPrice: totalPrice._sum.price || 0
                    }
                }).catch(err => {
                    console.log(err)
                    return res.status(401).json({msg: 'Preço não atualizado'})
                })
            }).catch(err => {
                console.log(err)
                return res.status(401).json({msg: 'Preço não somado'})
            })
        }).catch(err => {
            console.log(err, 'Item criado')
            return res.status(401).json({msg: 'criado'})
        })
    }).catch(err => {
        console.error('Carrinho não encontrado', err)
        return res.status(500).json({msg: 'Carrinho não encontrado'})
    })
})

export default router
