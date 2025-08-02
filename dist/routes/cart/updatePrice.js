"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _express = _interopRequireDefault(require("express"));
var _client = require("@prisma/client");
var _authToken = _interopRequireDefault(require("../auth/authToken.js"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
var router = _express["default"].Router();
var prisma = new _client.PrismaClient();
router.patch('/updataPrice', _authToken["default"], function (req, res) {
  var _req$body = req.body,
    quantCurrent = _req$body.quantCurrent,
    quantBefore = _req$body.quantBefore,
    idItem = _req$body.idItem,
    price = _req$body.price;
  var userId = req.user;
  var token = req.cookies.token;
  if (!token) return res.status(401).json({
    msg: 'Token inválido'
  });
  prisma.cart.findUnique({
    where: {
      userId: userId
    }
  }).then(function () {
    prisma.item.update({
      where: {
        id: idItem
      },
      data: {
        quant: quantCurrent,
        price: price / quantBefore * quantCurrent
      }
    }).then(function (item) {
      prisma.item.aggregate({
        _sum: {
          price: true
        },
        where: {
          cartId: item.cartId
        }
      }).then(function (totalPrice) {
        prisma.cart.update({
          where: {
            id: item.cartId
          },
          data: {
            totalPrice: totalPrice._sum.price || 0
          }
        })["catch"](function (err) {
          return console.log(err);
        });
      })["catch"](function (err) {
        return console.log(err);
      });
      res.status(200).json({
        msg: 'Price updated successfully'
      });
    })["catch"](function (err) {
      console.error(err);
      res.status(500).json({
        msg: 'Price was not updated'
      });
    });
  });
});
var _default = exports["default"] = router;