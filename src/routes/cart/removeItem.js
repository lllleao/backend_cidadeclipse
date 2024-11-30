import express from "express"
import { PrismaClient } from "@prisma/client"
import authMiddToken from '../auth/authToken.js'

const router = express.Router()
const prisma = new PrismaClient()

router.delete('/removeItem/:itemId', authMiddToken, async (req, res) => {
    const userId = req.user
    const token = req.cookies
    const { itemId } = req.params
    if (!token) return res.status(401).json({msg: 'Token inválido'})
    prisma.item.delete({
        where: {id: itemId}
    })
    .then(() => res.status(200).json({msg: 'Item excluído'}))
    .catch(err => {
        console.log(err)
        res.status(500).json({msg: 'Erro ao excluir o item'})
    })
})

export default router
