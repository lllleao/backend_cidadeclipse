"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _client = require("@prisma/client");
var _express = _interopRequireDefault(require("express"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
var prisma = new _client.PrismaClient();
var router = _express["default"].Router();
router.get('/ordersCompleted', function (req, res) {
  var userId = req.user;
  var token = req.cookies;
  if (!token) return res.status(401).json({
    msg: 'Requisição não autorizada'
  });
  prisma.purchase.findMany({
    where: {
      userId: userId
    }
  }).then(function (orderData) {
    console.log(orderData);
    res.status(200).json({
      orderData: orderData
    });
  })["catch"](function (err) {
    console.error(err);
  });
});
var _default = exports["default"] = router;