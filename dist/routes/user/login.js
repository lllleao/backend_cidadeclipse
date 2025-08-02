"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _express = _interopRequireDefault(require("express"));
var _bcrypt = _interopRequireDefault(require("bcrypt"));
var _client = require("@prisma/client");
var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));
var _expressValidator = require("express-validator");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const router = _express.default.Router();
const prisma = new _client.PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET;
const loginValidatorLogin = [(0, _expressValidator.body)('email').isEmail().trim().notEmpty().withMessage('Por favor, forneça um email válido'), (0, _expressValidator.body)('password').notEmpty().withMessage('Senha é obrigatória')];
router.post('/login', loginValidatorLogin, (req, res) => {
  const erros = (0, _expressValidator.validationResult)(req);
  const token = req.cookies.token;
  if (token) return res.status(400).json({
    msg: 'Login já realizado'
  });
  const {
    email,
    password
  } = req.body;
  if (!erros.isEmpty()) {
    return res.status(400).json({
      erros: erros.array()
    });
  }
  prisma.user_cd.findUnique({
    where: {
      email
    }
  }).then(user => {
    if (!user.isVerified) {
      return res.status(401).json({
        msg: 'Email não verificado'
      });
    }
    _bcrypt.default.compare(password, user.passwordUser).then(validPass => {
      if (!validPass) {
        return res.json({
          msg: 'Senha não encontrada',
          loginUserExist: false,
          passWordCorrect: true,
          loginSuccess: false
        });
      }
      const token = _jsonwebtoken.default.sign({
        userId: user.id
      }, JWT_SECRET, {
        expiresIn: '1h'
      });
      res.cookie('token', token, {
        path: '/',
        httpOnly: true,
        sameSite: 'none',
        maxAge: 3600000,
        secure: true
      });
      return res.status(201).json({
        passWordCorrect: false,
        msg: email,
        loginUserExist: false,
        loginSuccess: true
      });
    });
  }).catch(err => {
    console.log(err);
    return res.status(404).json({
      msg: 'Email incorreto'
    });
  });
});
var _default = exports.default = router;