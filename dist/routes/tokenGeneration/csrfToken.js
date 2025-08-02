"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _express = _interopRequireDefault(require("express"));
var _csrfTokens = require("../../logicsEmail/csrfTokens.js");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
var router = _express["default"].Router();
router.get('/get-csrfToken', function (req, res) {
  var token = (0, _csrfTokens.generateCsrfToken)();
  res.status(200).json({
    token: token
  });
});
var _default = exports["default"] = router;