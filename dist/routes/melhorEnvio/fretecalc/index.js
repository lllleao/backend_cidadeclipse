"use strict";

var _axios = _interopRequireDefault(require("axios"));
var _dotenv = _interopRequireDefault(require("dotenv"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
_dotenv["default"].config();
var data = {
  from: {
    postal_code: '60325004'
  },
  to: {
    postal_code: '60510205'
  },
  "package": {
    height: 22,
    width: 9,
    length: 17,
    weight: 0.5
  }
};
var config = {
  method: 'POST',
  url: 'https://sandbox.melhorenvio.com.br/api/v2/me/shipment/calculate',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    Authorization: "Bearer ".concat(process.env.ACCESS_TOKEN_ME),
    'User-Agent': 'Aplicação lucasleaolima@gmail.com'
  },
  data: data
};
(0, _axios["default"])(config).then(function (res) {
  return console.log(res);
})["catch"](function (err) {
  return console.log(err);
});