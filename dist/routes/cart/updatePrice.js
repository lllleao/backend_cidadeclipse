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
router.patch('/updataPrice', _authToken.default, (req, res) => {
  const {
    quantCurrent,
    quantBefore,
    idItem,
    price
  } = req.body;
  const userId = req.user;
  const {
    token
  } = req.cookies;
  if (!token) return res.status(401).json({
    msg: 'Token inválido'
  });
  prisma.cart.findUnique({
    where: {
      userId
    }
  }).then(() => {
    prisma.item.update({
      where: {
        id: idItem
      },
      data: {
        quant: quantCurrent,
        price: price / quantBefore * quantCurrent
      }
    }).then(item => {
      prisma.item.aggregate({
        _sum: {
          price: true
        },
        where: {
          cartId: item.cartId
        }
      }).then(totalPrice => {
        prisma.cart.update({
          where: {
            id: item.cartId
          },
          data: {
            totalPrice: totalPrice._sum.price || 0
          }
        }).catch(err => console.log(err));
      }).catch(err => console.log(err));
      res.status(200).json({
        msg: 'Price updated successfully'
      });
    }).catch(err => {
      console.error(err);
      res.status(500).json({
        msg: 'Price was not updated'
      });
    });
  });
});
var _default = exports.default = router;