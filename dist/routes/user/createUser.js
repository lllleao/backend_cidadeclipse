"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _express = _interopRequireDefault(require("express"));
var _bcrypt = _interopRequireDefault(require("bcrypt"));
var _client = require("@prisma/client");
var _expressValidator = require("express-validator");
var _index = require("../../tokenService/index.js");
var _index2 = _interopRequireDefault(require("../../emailService/index.js"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const router = _express.default.Router();
const prisma = new _client.PrismaClient();
const loginValidatorSign = [(0, _expressValidator.body)('email').isEmail().trim().notEmpty().withMessage('Por favor, forneça um email válido'), (0, _expressValidator.body)('name').notEmpty().trim().escape().withMessage('Por favor, forneça um nome válido'), (0, _expressValidator.body)('password').notEmpty().withMessage('Senha é obrigatória')];
router.post('/create', loginValidatorSign, async (req, res) => {
  const erros = (0, _expressValidator.validationResult)(req);
  const {
    name,
    email,
    password
  } = req.body;
  const tokenLogado = req.cookies.token;
  if (tokenLogado) return res.status(400).json({
    msg: 'Cadastro já realizado'
  });
  if (!erros.isEmpty()) return res.status(400).json({
    msg: 'Credenciais incorretas'
  });
  _bcrypt.default.genSalt(10).then(salt => _bcrypt.default.hash(password, salt)).then(hashPassword => {
    prisma.user_cd.findUnique({
      where: {
        email
      }
    }).then(user => {
      if (user) {
        return res.status(400).json({
          msg: user.email,
          userId: user.id,
          signUserExist: false
        });
      }
      return prisma.user_cd.create({
        data: {
          email,
          passwordUser: hashPassword,
          name,
          isVerified: false
        }
      }).then(user => {
        prisma.cart.create({
          data: {
            totalPrice: 0,
            userId: user.id,
            emailUser: email
          }
        }).catch(err => {
          console.log(err);
          return res.status(400).json({
            msg: 'Carrinho não criado'
          });
        });
        return (0, _index.generateJWTToken)(user).then(token => {
          prisma.user_cd.update({
            where: {
              id: user.id
            },
            data: {
              token
            }
          }).then(() => {
            res.status(201).json({
              msg: 'deu bom',
              signSuccess: true
            });
            return (0, _index2.default)(user.email, user.id, token);
          }).catch(err => console.log('Erro ao atualizar o usuário', err));
        }).catch(err => console.log('Token não gerado', err));
      });
    });
  }).catch(err => {
    console.log(err, 'Caiu aqui');
    res.status(500).json({
      msg: 'Erro no servidor, tente novamente'
    });
  });
});
var _default = exports.default = router;