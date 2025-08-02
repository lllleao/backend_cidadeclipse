"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _express = _interopRequireDefault(require("express"));
var _client = require("@prisma/client");
var _authToken = _interopRequireDefault(require("../auth/authToken.js"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const router = _express.default.Router();
const prisma = new _client.PrismaClient();
router.get('/cartItems', _authToken.default, async (req, res) => {
  const userId = req.user;
  const token = req.cookies;
  if (!token) return res.status(401).json({
    msg: 'Token inválido'
  });
  prisma.item.findMany({
    where: {
      userId
    }
  }).then(items => {
    if (!items) return res.status(501).json({
      msg: 'Itens não encontrados'
    });
    res.status(200).json({
      items
    });
  }).catch(err => {
    console.error(err);
    res.status(501).json({
      msg: 'Erro no servidor'
    });
  });
});
var _default = exports.default = router;