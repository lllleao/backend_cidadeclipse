import express from "express"
import { PrismaClient } from "@prisma/client"
import authMiddToken from '../auth/authToken.js'

const router = express.Router()
const prisma = new PrismaClient()

router.get('/profile', authMiddToken, async (req, res) => {
    const userId = req.user

    prisma.user_cd.findUnique({
        where: {
            id: userId
        }
    }).then(user => {
        prisma.purchase.findMany({
            where: { userId },
            include: { items: true }
        }).then(purchaseData => {
            const dataPurchase = purchaseData.map(order => {
                return {
                    totalPrice: order.totalPrice,
                    createdAt: order.createdAt,
                    items: order.items
                }   
            })
            console.log(purchaseData)

            res.status(201).json({ email: user.email, name: user.name, dataPurchase })
        })
    }).catch(err => {
        res.clearCookie('token')
        console.error(err)
        res.status(401).json({ msg: 'Não autorizado' })
    })
})

export default router
