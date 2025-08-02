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
router.get('/totalPrice', _authToken["default"], function (req, res) {
  var token = req.cookies.token;
  var userId = req.user;
  if (!token) return res.status(401).json({
    msg: 'Token inválido'
  });
  prisma.cart.findUnique({
    where: {
      userId: userId
    }
  }).then(function (response) {
    res.status(200).json({
      totalPrice: response.totalPrice
    });
  });
});
var _default = exports["default"] = router;