"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _express = _interopRequireDefault(require("express"));
var _db = require("../../database/db.js");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
var router = _express["default"].Router();
router.get('/free', function (req, res) {
  var data = (0, _db.getBooksPublic)();
  data.then(function (data) {
    res.json(data);
  })["catch"](function (err) {
    console.error(err);
    res.status(500).json({
      error: err
    });
  });
});
var _default = exports["default"] = router;