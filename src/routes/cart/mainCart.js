import express from "express"
import { PrismaClient } from "@prisma/client"
import { validationResult } from "express-validator"
import authMiddToken from '../auth/authToken.js'


const router = express.Router()

router.post('/cart', authMiddToken, async (req, res) => {
    const userId = req.user
})

export default router
