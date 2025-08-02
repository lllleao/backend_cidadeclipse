"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _client = require("@prisma/client");
const prisma = new _client.PrismaClient();
const createPurchase = (userId, buyerName, buyerAddress, buyerCPF, totalPrice, items) => {
  return new Promise((resolve, reject) => {
    prisma.purchase.create({
      data: {
        buyerAddress,
        buyerCPF,
        buyerName,
        totalPrice: parseFloat(totalPrice),
        createdAt: new Date(),
        userId
      }
    }).then(orderData => {
      prisma.purchaseItem.createMany({
        data: items.map(({
          name,
          quant,
          price,
          photo
        }) => {
          return {
            name,
            quant,
            price: parseFloat(price),
            photo,
            purchaseId: orderData.id
          };
        })
      }).catch(err => {
        reject(err);
      });
    }).catch(err => {
      reject(err);
    });
  });
};
var _default = exports.default = createPurchase;