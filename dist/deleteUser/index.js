"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.deleteUser = void 0;
var _express = _interopRequireDefault(require("express"));
var _client = require("@prisma/client");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
var prisma = new _client.PrismaClient();
var deleteUser = exports.deleteUser = function deleteUser(user) {
  prisma.user["delete"]({
    where: {
      id: user
    }
  }).then(function () {
    console.log('Usuario deletado');
  })["catch"](function (err) {
    console.error(err);
  })["finally"](function () {
    prisma.$disconnect();
  });
};