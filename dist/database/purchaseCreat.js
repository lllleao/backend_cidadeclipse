"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _client = require("@prisma/client");
var prisma = new _client.PrismaClient();
var createPurchase = function createPurchase(userId, buyerName, buyerAddress, buyerCPF, totalPrice, items) {
  return new Promise(function (resolve, reject) {
    prisma.purchase.create({
      data: {
        buyerAddress: buyerAddress,
        buyerCPF: buyerCPF,
        buyerName: buyerName,
        totalPrice: parseFloat(totalPrice),
        createdAt: new Date(),
        userId: userId
      }
    }).then(function (orderData) {
      prisma.purchaseItem.createMany({
        data: items.map(function (_ref) {
          var name = _ref.name,
            quant = _ref.quant,
            price = _ref.price,
            photo = _ref.photo;
          return {
            name: name,
            quant: quant,
            price: parseFloat(price),
            photo: photo,
            purchaseId: orderData.id
          };
        })
      })["catch"](function (err) {
        reject(err);
      });
    })["catch"](function (err) {
      reject(err);
    });
  });
};
var _default = exports["default"] = createPurchase;