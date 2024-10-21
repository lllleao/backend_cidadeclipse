import express from 'express'
import { generateCsrfToken } from '../../logicsEmail/csrfTokens.js'

const router = express.Router()

router.get('/csrf-token', (req, res) => {
    const csrfToken = generateCsrfToken()

    res.json({ csrfToken })
})

export default router
