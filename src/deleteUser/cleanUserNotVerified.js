import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()

const AUTH_TOKEN = process.env.AUTH_TOKEN

export default async function cleanupUnverifiedUsers(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({msg: 'Método não permitido'})
    }
    
    const authHeader = req.headers.authorization

    if (!authHeader || authHeader !== `Bearer ${AUTH_TOKEN}`) {
        return res.status(401).json({ message: "Não autorizado" });
    }
    
    const EXPIRATION_TIME = 2 * 60 * 1000
    const now = new Date()
    const expirationDate = new Date(now.getTime() - EXPIRATION_TIME)

    try {
        const deletedUsers = await prisma.user.deleteMany({
            where: {
                isVerified: false,
                createdAt: {lt: expirationDate}
            }
        })
        console.log(`Cleanup completed: ${deletedUsers.count} unverified users removed`)
    } catch (err) {
        console.error('Error durin cleanup', err)
    }
}
