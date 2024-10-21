import express from "express"
import { getBooksStore } from '../../database/db.js'

const router = express.Router()

router.get('/store-books', (req, res) => {
    const data = getBooksStore()
    data.then((data) => {
        res.json(data)
    }).catch((err) => res.status(500).json({ error: err }))
})

router.get('/store-books/:id', (req, res) => {
    const { id } = req.params
    const book = getBooksStore(Number(id))

    book.then(data => {
        res.json(data)
    }).catch((err) => res.status(500).json({ error: err }))
})

export default router
