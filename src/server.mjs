import express from 'express'
import dotenv from 'dotenv'
import nodemailer from 'nodemailer'
import helmet from 'helmet'
import cors from 'cors'
import { body, validationResult } from 'express-validator'
import rateLimit from 'express-rate-limit'
import csrf from 'csrf'
dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

app.use(express.json())

app.use(helmet())
const tokens = new csrf()

function csrfCheck(req, res, next) {
    const tokenFromHeader = req.headers['csrf-token']

    if (tokenFromHeader && tokens.verify(process.env.CSRF_SECRET, tokenFromHeader)) {
        next()
    } else {
        res.status(403).json({ message: 'CSRF token invalid or not found' })
    }
}

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
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'))
        }
    },
    methods: 'GET,POST',
    allowedHeaders: 'Content-Type, CSRF-Token'
}))

const sendDataLimiter = rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 20,
    message: 'Muitas requisições deste IP, por favor tente novamente mais tarde'
})

app.use('/send', sendDataLimiter)

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
})

app.get('/', (req, res) => {
    res.send('Rodando')
})

app.get('/csrf-token', (req, res) => {
    const csrfToken = tokens.create(process.env.CSRF_SECRET)

    res.json({csrfToken})
})

function formatPhoneNumber(value) {
    const cleaned = value.replace(/[^\d]/g, '')
    const match = cleaned.match(/^(\d{2})(\d{5})(\d{4})$/)
    if (match) {
        return `(${match[1]}) ${match[2]}-${match[3]}`
    }
    return value
}

const validateData = [
    body('emailUser').trim().isEmail().withMessage('Email inválido'),
    body('name').trim().notEmpty().withMessage('Nome é obrigatório'),
    body('text').trim().notEmpty().withMessage('Mensagem é obrigatória'),
    body('number').optional({ checkFalsy: true }).trim().isNumeric().withMessage('Número inválido')
]

app.post('/send', csrfCheck,
    validateData, (req, res) => {
        const erros = validationResult(req)

        if (!erros.isEmpty()) {
            return res.status(400).json({ erros: erros.array() })
        }

        const { emailUser, text, number, name } = req.body

        const formattedNumber = formatPhoneNumber(number)

        if (!emailUser || !text || !name) return res.status(400).send('Existe algum campo obrigatório faltando')

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_USER,
            replyTo: emailUser,
            subject: 'Contato site',
            html: `<h2>${name} - ${emailUser}</h2><br/><br/><h3>${text}</h3><br/><h4>Telefone: ${formattedNumber}</h4>`
        }

        transporter.sendMail(mailOptions).then(info => {
            res.status(200).send(req.body)
        }).catch(error => {
            console.error('Erro ao enviar', error)
            res.status(500).send('Erro ao enviar o email')
        })
    })

app.listen(PORT, () => {
    console.log(`Running on Port ${PORT}`)
})
