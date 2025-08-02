"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.csrfCheck = csrfCheck;
exports.generateCsrfToken = generateCsrfToken;
var _csrf = _interopRequireDefault(require("csrf"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const tokens = new _csrf.default();
function csrfCheck(req, res, next) {
  const tokenFromHeader = req.headers['csrf-token'];
  if (tokenFromHeader && tokens.verify(process.env.CSRF_SECRET, tokenFromHeader)) {
    next();
  } else {
    res.status(403).json({
      message: 'CSRF token invalid or not found'
    });
  }
}
function generateCsrfToken() {
  return tokens.create(process.env.CSRF_SECRET);
}