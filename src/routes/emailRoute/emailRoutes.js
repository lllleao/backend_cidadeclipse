import express from 'express'
import { body, validationResult } from 'express-validator'
import sendEmail from '../../logicsEmail/emailLogic.js'
import { csrfCheck } from '../../logicsEmail/csrfTokens.js'

const router = express.Router()

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

router.post('/send', csrfCheck, validateData, async (req, res) => {
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

        try {
            await sendEmail(mailOptions)
            res.status(200).send(req.body);
        } catch (error) {
            console.error('Erro ao enviar', error);
            res.status(500).send({msg: 'Erro ao enviar o email'});
        }
})

export default router
