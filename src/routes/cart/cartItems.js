import express from "express"
import { PrismaClient } from "@prisma/client"
import authMiddToken from '../auth/authToken.js'

const router = express.Router()
const prisma = new PrismaClient()

router.get('/cartItems', authMiddToken, async (req, res) => {
    const userId = req.user
    const token = req.cookies

    if (!token) return res.status(401).json({msg: 'Token inválido'})

    prisma.item.findMany({
        where: {userId}
    }).then(items => {
        if (!items) return res.status(501).json({msg: 'Itens não encontrados'})
        
        res.status(200).json({items})
    }).catch(err => {
        console.error(err)
        res.status(501).json({msg: 'Erro no servidor'})
    })
})

export default router
