"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _express = _interopRequireDefault(require("express"));
var _authToken = _interopRequireDefault(require("../auth/authToken.js"));
var _expressValidator = require("express-validator");
var _index = _interopRequireDefault(require("../../cpfValidation/index.js"));
var _client = require("@prisma/client");
var _purchaseCreat = _interopRequireDefault(require("../../database/purchaseCreat.js"));
var _criarCobrança = _interopRequireDefault(require("../apiPix/criarCobran\xE7a.js"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const router = _express.default.Router();
const prisma = new _client.PrismaClient();
const validationPurchase = [(0, _expressValidator.body)('name').notEmpty().trim().escape().isLength({
  min: 0,
  max: 40
}).withMessage('Por favor, forneça um nome válido'), (0, _expressValidator.body)('cpf').notEmpty().isNumeric().escape().isLength({
  min: 11,
  max: 11
}).withMessage('Por favor, forneça um cpf válido'), (0, _expressValidator.body)('cep').notEmpty().isNumeric().escape().isLength({
  min: 8,
  max: 8
}).withMessage('Por favor, forneça um cep válido'), (0, _expressValidator.body)('street').notEmpty().escape().isLength({
  min: 0,
  max: 40
}).withMessage('Por favor, forneça uma rua válida'), (0, _expressValidator.body)('neighborhood').notEmpty().escape().isLength({
  min: 0,
  max: 40
}).withMessage('Por favor, forneça um bairro válido'), (0, _expressValidator.body)('complement').optional().isLength({
  min: 0,
  max: 40
}), (0, _expressValidator.body)('number').notEmpty().escape().isLength({
  min: 0,
  max: 6
}).withMessage('Por favor, forneça um complemento válido')];
router.post('/purchase', validationPurchase, _authToken.default, (req, res) => {
  const erros = (0, _expressValidator.validationResult)(req);
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
  } = req.body;
  const userId = req.user;
  const isCpfValid = (0, _index.default)(cpf);
  if (!erros.isEmpty()) {
    return res.status(401).json({
      erros: erros.array()
    });
  }
  if (!isCpfValid) return res.status(401).json({
    mgs: 'CPF Inválido'
  });
  const address = street + ' ' + ' ' + neighborhood + ' ' + number + ' ' + cep + ' ' + complement;
  console.log(cpf, name, parseFloat(totalPrice).toFixed(2));
  (0, _criarCobrança.default)(cpf, name, parseFloat(totalPrice).toFixed(2)).then(response => {
    console.log('aqui');
    res.status(200).json({
      pixData: response.data
    });
    (0, _purchaseCreat.default)(userId, name, address, cpf, totalPrice, itemsInfo).then(err => {
      console.log(err, 'opa 1');
    }).catch(err => {
      console.error(err, 'opa 2');
    });
  }).catch(err => {
    console.error(err, 'opa');
    res.status(405).json({
      msg: 'Cobrança não criada'
    });
  });
});
var _default = exports.default = router;