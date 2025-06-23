import express from 'express'
import dotenv from 'dotenv'
import helmet from 'helmet'
import cors from 'cors'
import rateLimit from 'express-rate-limit'
import emailRoutes from './routes/emailRoute/emailRoutes.js'
import routeCrsf from './routes/tokenGeneration/csrfToken.js'
import publicBooks from './routes/books/publickBooks.js'
import storeBooks from './routes/books/storeBooks.js'
import createUser from './routes/user/createUser.js'
import login from './routes/user/login.js'
import profile from './routes/user/profile.js'
import logout from './routes/user/logout.js'
import cookieParser from 'cookie-parser'

import addToCart from './routes/cart/addToCart.js'
import cartItems from './routes/cart/cartItems.js'
import removeItem from './routes/cart/removeItem.js'
import updatePrice from './routes/cart/updatePrice.js'
import getTotalPrice from './routes/cart/getTotalPrice.js'

import addPurc from './routes/checkout/addPurchase.js'

import confirm from './routes/user/confirm.js'
import path from 'path'
import { fileURLToPath } from 'url'
import authMiddToken from './routes/auth/authToken.js'
import cleanupUnverifiedUsers from './deleteUser/cleanUserNotVerified.js'

import ordersCompleted from './routes/user/purchaseCompleted.js'

dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const PORT = process.env.PORT || 9001
app.use(express.static(path.join(__dirname, '..', 'public')))

app.use(express.json())
app.use(helmet())
app.use(cookieParser())

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
    methods: 'GET,POST,OPTIONS,DELETE,PATCH',
    allowedHeaders: ['Content-Type', 'CSRF-Token', 'authorization'],
    credentials: true
}))

const sendDataLimiter = rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 20,
    message: 'Muitas requisições deste IP, por favor tente novamente mais tarde'
})


app.use('/', publicBooks)
app.use('/', storeBooks)

app.use('/api', sendDataLimiter, emailRoutes)
app.use('/', routeCrsf)

// user
app.use('/', createUser)
app.use('/', login)
app.use('/', profile)
app.use('/', logout)
app.use('/', confirm)

app.use('/', addToCart)
app.use('/', updatePrice)
app.use('/', cartItems)
app.use('/', removeItem)
app.use('/', getTotalPrice)
app.post('/cleanupUsers', cleanupUnverifiedUsers)
app.use('/', addPurc)
app.use('/', ordersCompleted)

// Check token
app.use('/getCookie', authMiddToken, (req, res) => {

    res.status(200).json({msg: 'Conexão válida'})
})

app.listen(PORT, () => {
    console.log(`Running on Port ${PORT}`)
})
