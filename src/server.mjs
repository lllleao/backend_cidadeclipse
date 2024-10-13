import express from 'express'
import dotenv from 'dotenv'
import helmet from 'helmet'
import cors from 'cors'
import rateLimit from 'express-rate-limit'
import { generateCsrfToken } from './routes/emailSend/csrfTokens.js'
import emailRoutes from './routes/emailRoutes.js'
import { getBooksPublic, getBooksStore } from './database/db.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 9001

app.use(express.json())
app.use(helmet())

app.use(helmet.contentSecurityPolicy({
    directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'"],
        imgSrc: ["'self'"],
        connectSrc: ["'self'"],
        frameSrc: ["'none'"],
        objectSrc: ["'none'"],
        baseUri: ["'self'"],
        formAction: ["'self'"],
    }
}))

const allowedOrigins = process.env.ALLOWED_ORIGINS.split(',')

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'))
        }
    },
    methods: 'GET,POST,OPTIONS',
    allowedHeaders: ['Content-Type', 'CSRF-Token'],
    credentials: true
}))

const sendDataLimiter = rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 20,
    message: 'Muitas requisições deste IP, por favor tente novamente mais tarde'
})


app.get('/public-books', (req, res) => {
    const data = getBooksPublic()
    data.then((data) => {
        res.json(data)
    }).catch((err) => res.status(500).json({ error: err }))
})

app.get('/store-books', (req, res) => {
    const data = getBooksStore()
    data.then((data) => {
        res.json(data)
    }).catch((err) => res.status(500).json({ error: err }))
})

app.get('/store-books/:id', (req, res) => {
    const { id } = req.params
    // console.log(id)
    const book = getBooksStore(Number(id))

    book.then(data => {
        res.json(data)
    }).catch((err) => res.status(500).json({ error: err }))
})

app.use('/api', emailRoutes)
app.get('/csrf-token', (req, res) => {
    const csrfToken = generateCsrfToken()

    res.json({ csrfToken })
})

app.listen(PORT, () => {
    console.log(`Running on Port ${PORT}`)
})
