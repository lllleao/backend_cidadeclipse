import express from 'express'
import { generateCsrfToken } from '../../logicsEmail/csrfTokens.js'

const router = express.Router()

router.get('/get-csrfToken', (req, res) => {
    const token = generateCsrfToken()

    res.status(200).json({ token })
})

export default router
