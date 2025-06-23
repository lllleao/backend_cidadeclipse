import { PrismaClient } from "@prisma/client";
import express from "express";

const prisma = new PrismaClient()
const router = express.Router()

router.get('/ordersCompleted', (req, res) => {
    const userId = req.user
    const token = req.cookies

    if (!token) return res.status(401).json({ msg: 'Requisição não autorizada' })

    prisma.purchase.findMany({
        where: {
            userId
        }
    }).then(orderData => {
        console.log(orderData)
        res.status(200).json({orderData})
    }).catch(err => {
        console.error(err)
    })
})

export default router
