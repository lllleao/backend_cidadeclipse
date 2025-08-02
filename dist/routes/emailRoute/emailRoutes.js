"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _express = _interopRequireDefault(require("express"));
var _expressValidator = require("express-validator");
var _emailLogic = _interopRequireDefault(require("../../logicsEmail/emailLogic.js"));
var _csrfTokens = require("../../logicsEmail/csrfTokens.js");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const router = _express.default.Router();
function formatPhoneNumber(value) {
  const cleaned = value.replace(/[^\d]/g, '');
  const match = cleaned.match(/^(\d{2})(\d{5})(\d{4})$/);
  if (match) {
    return `(${match[1]}) ${match[2]}-${match[3]}`;
  }
  return value;
}
const validateData = [(0, _expressValidator.body)('emailUser').trim().notEmpty().isEmail().withMessage('Email inválido'), (0, _expressValidator.body)('name').trim().notEmpty().escape().withMessage('Nome é obrigatório'), (0, _expressValidator.body)('text').trim().notEmpty().escape().withMessage('Mensagem é obrigatória'), (0, _expressValidator.body)('number').optional({
  checkFalsy: true
}).trim().isNumeric().withMessage('Número inválido')];
router.post('/send', _csrfTokens.csrfCheck, validateData, async (req, res) => {
  const erros = (0, _expressValidator.validationResult)(req);
  if (!erros.isEmpty()) {
    return res.status(400).json({
      erros: erros.array()
    });
  }
  const {
    emailUser,
    text,
    number,
    name
  } = req.body;
  const formattedNumber = formatPhoneNumber(number);
  if (!emailUser || !text || !name) return res.status(400).send('Existe algum campo obrigatório faltando');
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_USER,
    replyTo: emailUser,
    subject: 'Contato site',
    html: `<h2>${name} - ${emailUser}</h2><br/><br/><h3>${text}</h3><br/><h4>Telefone: ${formattedNumber}</h4>`
  };
  try {
    await (0, _emailLogic.default)(mailOptions);
    res.status(200).send(req.body);
  } catch (error) {
    console.error('Erro ao enviar', error);
    res.status(500).send({
      msg: 'Erro ao enviar o email'
    });
  }
});
var _default = exports.default = router;