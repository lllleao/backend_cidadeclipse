"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _client = require("@prisma/client");
var _express = _interopRequireDefault(require("express"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const prisma = new _client.PrismaClient();
const router = _express.default.Router();
router.get('/ordersCompleted', (req, res) => {
  const userId = req.user;
  const token = req.cookies;
  if (!token) return res.status(401).json({
    msg: 'Requisição não autorizada'
  });
  prisma.purchase.findMany({
    where: {
      userId
    }
  }).then(orderData => {
    console.log(orderData);
    res.status(200).json({
      orderData
    });
  }).catch(err => {
    console.error(err);
  });
});
var _default = exports.default = router;