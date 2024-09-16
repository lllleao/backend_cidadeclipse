import express from 'express'
import dotenv from 'dotenv'
import helmet from 'helmet'
import cors from 'cors'
import rateLimit from 'express-rate-limit'
import { generateCsrfToken } from './routes/emailSend/csrfTokens.js'
import emailRoutes from './routes/emailRoutes.js'
import getBooks from './database/db.js'

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

const allowedOrigins = process.env.ALLOWED_ORIGINS

app.use(cors({
    origin:'*',
    methods: 'GET,POST',
    allowedHeaders: 'Content-Type, CSRF-Token'
}))

const sendDataLimiter = rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 20,
    message: 'Muitas requisições deste IP, por favor tente novamente mais tarde'
})

app.get('/', (req, res) => {
    const data = getBooks()
    data.then((data) => res.json(data)).catch((err) => res.status(500).json({ error: err }))
})

app.use('/api', sendDataLimiter, emailRoutes)
app.get('/csrf-token', (req, res) => {
    const csrfToken = generateCsrfToken()
    
    res.json({ csrfToken })
})

app.listen(PORT, () => {
    console.log(`Running on Port ${PORT}`)
})
