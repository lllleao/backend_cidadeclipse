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
import { loginValidatorLogin } from './routes/auth/checkEmailPass.js'
import cookieParser from 'cookie-parser'
import authMiddToken from './routes/auth/authToken.js'
import cart from './routes/cart/mainCart.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 9001

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
    methods: 'GET,POST,OPTIONS',
    allowedHeaders: ['Content-Type', 'CSRF-Token'],
    credentials: true
}))

const sendDataLimiter = rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 20,
    message: 'Muitas requisições deste IP, por favor tente novamente mais tarde'
})


app.use('/', publicBooks)
app.use('/store', storeBooks)

app.use('/api', sendDataLimiter, emailRoutes)
app.use('/', routeCrsf)

// user
app.use('/', createUser)
app.use('/', loginValidatorLogin, login)
app.use('/', authMiddToken, profile)
app.use('/', logout)
app.use('/', authMiddToken, cart)

app.listen(PORT, () => {
    console.log(`Running on Port ${PORT}`)
})
