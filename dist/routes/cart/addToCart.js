"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _express = _interopRequireDefault(require("express"));
var _client = require("@prisma/client");
var _expressValidator = require("express-validator");
var _authToken = _interopRequireDefault(require("../auth/authToken.js"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
var router = _express["default"].Router();
var prisma = new _client.PrismaClient();
router.post('/addCart', _authToken["default"], function (req, res) {
  var _req$body = req.body,
    photo = _req$body.photo,
    price = _req$body.price,
    quant = _req$body.quant,
    name = _req$body.name;
  var userId = req.user;
  var token = req.cookies;
  if (!token) return res.status(401).json({
    msg: 'Requisição não autorizada'
  });
  prisma.cart.findUnique({
    where: {
      userId: userId
    }
  }).then(function (cart) {
    prisma.item.findMany({
      where: {
        cartId: cart.id
      }
    }).then(function (itemsCart) {
      console.log(itemsCart);
      prisma.item.create({
        data: {
          cartId: cart.id,
          userId: userId,
          name: name,
          photo: photo,
          price: price,
          quant: quant
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
            console.log(err);
            return res.status(401).json({
              msg: 'Preço não atualizado'
            });
          });
        })["catch"](function (err) {
          console.log(err);
          return res.status(401).json({
            msg: 'Preço não somado'
          });
        });
      })["catch"](function (err) {
        console.log(err, 'Item não criado');
        return res.status(401).json({
          msg: 'não criado'
        });
      });
    })["catch"](function (err) {
      console.log(err, 'Itens não encontrados');
      return res.status(401).json({
        msg: 'não criado'
      });
    });
  })["catch"](function (err) {
    console.error('Carrinho não encontrado', err);
    return res.status(500).json({
      msg: 'Carrinho não encontrado'
    });
  });
});
var _default = exports["default"] = router;