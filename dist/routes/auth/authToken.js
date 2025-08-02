"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const JWT_SECRET = process.env.JWT_SECRET;
const authMiddToken = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({
      msg: 'Token ausente, autorização negada'
    });
  }
  _jsonwebtoken.default.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({
        msg: 'Token inválido'
      });
    }
    req.user = decoded.userId;
    next();
  });
};
var _default = exports.default = authMiddToken;