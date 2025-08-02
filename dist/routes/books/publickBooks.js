"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _express = _interopRequireDefault(require("express"));
var _db = require("../../database/db.js");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const router = _express.default.Router();
router.get('/free', (req, res) => {
  const data = (0, _db.getBooksPublic)();
  data.then(data => {
    res.json(data);
  }).catch(err => {
    console.error(err);
    res.status(500).json({
      error: err
    });
  });
});
var _default = exports.default = router;