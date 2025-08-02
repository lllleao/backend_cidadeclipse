"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.verifyEmailToken = exports.generateJWTToken = void 0;
var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
var JWT_SECRET = process.env.JWT_SECRET;
var generateJWTToken = exports.generateJWTToken = function generateJWTToken(user) {
  return new Promise(function (resolve, reject) {
    var payload = {
      email: user.email,
      userId: user.id
    };
    var expires = {
      expiresIn: '20m'
    };
    _jsonwebtoken["default"].sign(payload, JWT_SECRET, expires, function (err, token) {
      if (err) {
        console.log(err, 'expirado');
        return reject(err);
      }
      resolve(token);
    });
  });
};
var verifyEmailToken = exports.verifyEmailToken = function verifyEmailToken(token) {
  return new Promise(function (resolve, reject) {
    _jsonwebtoken["default"].verify(token, JWT_SECRET, function (err, decoded) {
      if (err) {
        reject(err);
      }
      resolve(decoded);
    });
  });
};