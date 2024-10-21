import express from "express"
import { PrismaClient } from "@prisma/client"
import { validationResult } from "express-validator"

const router = express.Router()

router.post('/cart', async (req, res) => {
    const userId = req.user
    console.log(userId)
})

export default router
