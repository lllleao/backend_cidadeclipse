import express from "express"
import { PrismaClient } from "@prisma/client"
import { verifyEmailToken } from "../../tokenService/index.js"
import path from 'path'
import { fileURLToPath } from 'url'
import { deleteUser } from "../../deleteUser/index.js"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const router = express.Router()
const prisma = new PrismaClient()

router.get('/confirm', (req, res) => {
    const { token, userId } = req.query

    verifyEmailToken(token).then(decoded => {
        const {userId} = decoded

        prisma.user.findUnique({
            where: { id: userId }
        }).then(user => {
            if (!user) {
                return res.status(400).sendFile(path.join(__dirname, '..', '..', '..', 'public', 'userEmpty', 'index.html'))
            }
            if (user.token !== token || user.isVerified) {
                return res.status(400).sendFile(path.join(__dirname, '..', '..', '..', 'public', 'errorToken', 'index.html'))
            }

            return prisma.user.update({
                where: {id: userId},
                data: {
                    isVerified: true,
                    token: null,
                }
            }).then(() => {
                res.status(200).sendFile(path.join(__dirname, '..', '..', '..', 'public', 'success', 'index.html'))
            })
        })

    }).catch(err => {
        deleteUser(userId)
        console.log(err)
        return res.status(400).sendFile(path.join(__dirname, '..', '..', '..', 'public', 'tokenExpire', 'index.html'))
    })
})

export default router
