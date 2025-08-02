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
router.get('/profile', _authToken.default, async (req, res) => {
  const userId = req.user;
  prisma.user_cd.findUnique({
    where: {
      id: userId
    }
  }).then(user => {
    prisma.purchase.findMany({
      where: {
        userId
      },
      include: {
        items: true
      }
    }).then(purchaseData => {
      const dataPurchase = purchaseData.map(order => {
        return {
          totalPrice: order.totalPrice,
          createdAt: order.createdAt,
          items: order.items
        };
      });
      console.log(purchaseData);
      res.status(201).json({
        email: user.email,
        name: user.name,
        dataPurchase
      });
    });
  }).catch(err => {
    res.clearCookie('token');
    console.error(err);
    res.status(401).json({
      msg: 'Não autorizado'
    });
  });
});
var _default = exports.default = router;