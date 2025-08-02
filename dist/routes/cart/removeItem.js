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
router.delete('/removeItem/:name', _authToken.default, async (req, res) => {
  const {
    token
  } = req.cookies;
  const {
    name
  } = req.params;
  const userId = req.user;
  if (!token) return res.status(401).json({
    msg: 'Token inválido'
  });
  prisma.cart.findUnique({
    where: {
      userId
    }
  }).then(cart => {
    prisma.item.delete({
      where: {
        cartId_name: {
          cartId: cart.id,
          name: name
        }
      }
    }).then(item => {
      prisma.cart.findUnique({
        where: {
          id: item.cartId
        }
      }).then(cart => {
        prisma.cart.update({
          where: {
            id: item.cartId
          },
          data: {
            totalPrice: cart.totalPrice - item.price
          }
        }).catch(err => console.error('Não atualizou o preço total', err));
      }).catch(err => console.error('Não encontrou o cart', err));
      res.status(200).json({
        msg: 'Item excluído'
      });
    }).catch(err => {
      console.log(err);
      res.status(500).json({
        msg: 'Erro ao excluir o item'
      });
    });
  });
});
var _default = exports.default = router;