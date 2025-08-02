"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.deleteUser = void 0;
var _express = _interopRequireDefault(require("express"));
var _client = require("@prisma/client");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const prisma = new _client.PrismaClient();
const deleteUser = user => {
  prisma.user.delete({
    where: {
      id: user
    }
  }).then(() => {
    console.log('Usuario deletado');
  }).catch(err => {
    console.error(err);
  }).finally(() => {
    prisma.$disconnect();
  });
};
exports.deleteUser = deleteUser;