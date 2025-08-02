"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _express = _interopRequireDefault(require("express"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const router = _express.default.Router();
router.get('/logout', (req, res) => {
  const token = req.cookies;
  res.clearCookie('token');
  res.json({
    msg: 'Logout realizado'
  });
});
var _default = exports.default = router;