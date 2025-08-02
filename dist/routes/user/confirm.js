"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _express = _interopRequireDefault(require("express"));
var _client = require("@prisma/client");
var _index = require("../../tokenService/index.js");
var _path = _interopRequireDefault(require("path"));
var _url = require("url");
var _index2 = require("../../deleteUser/index.js");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
var _filename = (0, _url.fileURLToPath)(import.meta.url);
var _dirname = _path["default"].dirname(_filename);
var router = _express["default"].Router();
var prisma = new _client.PrismaClient();
router.get('/confirm', function (req, res) {
  var _req$query = req.query,
    token = _req$query.token,
    userId = _req$query.userId;
  (0, _index.verifyEmailToken)(token).then(function (decoded) {
    var userId = decoded.userId;
    prisma.user_cd.findUnique({
      where: {
        id: userId
      }
    }).then(function (user) {
      if (!user) {
        return res.status(400).sendFile(_path["default"].join(_dirname, '..', '..', '..', 'public', 'userEmpty', 'index.html'));
      }
      if (user.token !== token || user.isVerified) {
        return res.status(400).sendFile(_path["default"].join(_dirname, '..', '..', '..', 'public', 'errorToken', 'index.html'));
      }
      return prisma.user_cd.update({
        where: {
          id: userId
        },
        data: {
          isVerified: true,
          token: null
        }
      }).then(function () {
        res.status(200).sendFile(_path["default"].join(_dirname, '..', '..', '..', 'public', 'success', 'index.html'));
      });
    });
  })["catch"](function (err) {
    (0, _index2.deleteUser)(userId);
    console.log(err);
    return res.status(400).sendFile(_path["default"].join(_dirname, '..', '..', '..', 'public', 'tokenExpire', 'index.html'));
  });
});
var _default = exports["default"] = router;