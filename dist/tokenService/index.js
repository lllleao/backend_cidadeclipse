"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.verifyEmailToken = exports.generateJWTToken = void 0;
var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const JWT_SECRET = process.env.JWT_SECRET;
const generateJWTToken = user => {
  return new Promise((resolve, reject) => {
    const payload = {
      email: user.email,
      userId: user.id
    };
    const expires = {
      expiresIn: '20m'
    };
    _jsonwebtoken.default.sign(payload, JWT_SECRET, expires, (err, token) => {
      if (err) {
        console.log(err, 'expirado');
        return reject(err);
      }
      resolve(token);
    });
  });
};
exports.generateJWTToken = generateJWTToken;
const verifyEmailToken = token => {
  return new Promise((resolve, reject) => {
    _jsonwebtoken.default.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) {
        reject(err);
      }
      resolve(decoded);
    });
  });
};
exports.verifyEmailToken = verifyEmailToken;