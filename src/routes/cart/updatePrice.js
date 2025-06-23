import express from 'express'
import { PrismaClient } from '@prisma/client'
import authMiddToken from '../auth/authToken.js'

const router = express.Router()
const prisma = new PrismaClient()

router.patch('/updataPrice', authMiddToken, (req, res) => {
    const { quantCurrent, quantBefore, idItem, price } = req.body
    const userId = req.user
    const { token } = req.cookies

    if (!token) return res.status(401).json({ msg: 'Token inválido' })

    prisma.cart.findUnique({
            where: {
                userId
            }
        }).then(() => {
            prisma.item.update({
                    where: {
                        id: idItem
                    },
                    data: {
                        quant: quantCurrent,
                        price: (price / quantBefore) * quantCurrent
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
                        }).then((totalPrice) => {
                            prisma.cart.update({
                                    where: { id: item.cartId },
                                    data: {
                                        totalPrice: totalPrice._sum.price || 0
                                    }
                                }).catch((err) => console.log(err))
                        }).catch((err) => console.log(err))
                    res.status(200).json({ msg: 'Price updated successfully' })
                }).catch((err) => {
                    console.error(err)
                    res.status(500).json({ msg: 'Price was not updated' })
                })
        })
})

export default router
