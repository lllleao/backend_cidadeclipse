import express from "express"
import { PrismaClient } from "@prisma/client"
import authMiddToken from '../auth/authToken.js'

const router = express.Router()
const prisma = new PrismaClient()

router.get('/profile', authMiddToken, async (req, res) => {
    const userId = req.user

    prisma.user.findUnique({
        where: {
            id: userId
        }
    }).then(user => {
        res.status(201).json({ id: user.id, email: user.email, name: user.name })
    }).catch(err => {
        res.clearCookie('token')
        console.error(err)
        res.status(401).json({ msg: 'Não autorizado' })
    })
})

export default router
