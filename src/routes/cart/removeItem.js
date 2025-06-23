import express from 'express'
import { PrismaClient } from '@prisma/client'
import authMiddToken from '../auth/authToken.js'

const router = express.Router()
const prisma = new PrismaClient()

router.delete('/removeItem/:name', authMiddToken, async (req, res) => {
    const { token } = req.cookies
    const { name } = req.params
    const userId = req.user
    if (!token) return res.status(401).json({ msg: 'Token inválido' })

    prisma.cart.findUnique({
            where: { userId }
        }).then((cart) => {
            prisma.item.delete({
                    where: { cartId_name: {
                        cartId: cart.id,
                        name: name
                    } }
                }).then((item) => {
                    prisma.cart
                        .findUnique({
                            where: { id: item.cartId }
                        }).then((cart) => {
                            prisma.cart.update({
                                    where: { id: item.cartId },
                                    data: {
                                        totalPrice: cart.totalPrice - item.price
                                    }
                                }).catch((err) =>
                                    console.error(
                                        'Não atualizou o preço total',
                                        err
                                    )
                                )
                        }).catch((err) =>
                            console.error('Não encontrou o cart', err)
                        )
                    res.status(200).json({ msg: 'Item excluído' })
                }).catch((err) => {
                    console.log(err)
                    res.status(500).json({ msg: 'Erro ao excluir o item' })
                })
        })
})

export default router
