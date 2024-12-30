import express from "express"
import { getBooksPublic } from '../../database/db.js'

const router = express.Router()

router.get('/public-books', (req, res) => {
    const data = getBooksPublic()
    data.then((data) => {
        res.json(data)
    }).catch((err) => {
        console.error(err)
        res.status(500).json({ error: err })
    })
})

export default router
