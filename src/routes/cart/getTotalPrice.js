import express from "express"
import { PrismaClient } from "@prisma/client"
import authMiddToken from '../auth/authToken.js'

const router = express.Router()
const prisma = new PrismaClient()

router.get('/totalPrice', authMiddToken, (req, res) => {
    const { token } = req.cookies
    const userId = req.user

    if (!token) return res.status(401).json({msg: 'Token inválido'})
    
    prisma.cart.findUnique({
        where: { userId }
    }).then((response) => {
        res.status(200).json({totalPrice: response.totalPrice})
    })

})

export default router
