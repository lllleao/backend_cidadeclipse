import express from 'express'
import authMiddToken from '../auth/authToken.js'
import { validationResult, body } from 'express-validator'
import cpfValidator from '../../cpfValidation/index.js'
import { PrismaClient } from '@prisma/client'
import createPurchase from '../../database/purchaseCreat.js'
import criarCob from '../apiPix/criarCobrança.js'

const router = express.Router()
const prisma = new PrismaClient()

const validationPurchase = [
    body('name')
        .notEmpty()
        .trim()
        .escape()
        .isLength({ min: 0, max: 40 })
        .withMessage('Por favor, forneça um nome válido'),
    body('cpf')
        .notEmpty()
        .isNumeric()
        .escape()
        .isLength({ min: 11, max: 11 })
        .withMessage('Por favor, forneça um cpf válido'),
    body('cep')
        .notEmpty()
        .isNumeric()
        .escape()
        .isLength({ min: 8, max: 8 })
        .withMessage('Por favor, forneça um cep válido'),
    body('street')
        .notEmpty()
        .escape()
        .isLength({ min: 0, max: 40 })
        .withMessage('Por favor, forneça uma rua válida'),
    body('neighborhood')
        .notEmpty()
        .escape()
        .isLength({ min: 0, max: 40 })
        .withMessage('Por favor, forneça um bairro válido'),
    body('complement').optional().isLength({ min: 0, max: 40 }),
    body('number')
        .notEmpty()
        .escape()
        .isLength({ min: 0, max: 6 })
        .withMessage('Por favor, forneça um complemento válido')
]

router.post(
    '/purchase',
    validationPurchase,
    authMiddToken,
    async (req, res) => {
        const erros = validationResult(req)
        const {
            name,
            cpf,
            cep,
            street,
            neighborhood,
            complement,
            number,
            itemsInfo,
            totalPrice
        } = req.body

        const userId = req.user
        const isCpfValid = cpfValidator(cpf)
        if (!erros.isEmpty()) {
            return res.status(401).json({ erros: erros.array() })
        }

        if (!isCpfValid) return res.status(401).json({ mgs: 'CPF Inválido' })

        const address = street+' '+' '+neighborhood+' '+number+' '+cep+' '+complement

        try {
            // const newPurchase = await createPurchase(userId, name, address, cpf, totalPrice, itemsInfo)
            // const pixData = await criarCob('12345678909', 'Lucas Leão', '10.00')
            console.log(pixData)
            res.status(200).json({pixData: pixData.data})
        } catch (err) {
            console.error(err)
            res.status(405).json({ msg: 'Cobrança não criada' })
        }
    }
)

export default router
