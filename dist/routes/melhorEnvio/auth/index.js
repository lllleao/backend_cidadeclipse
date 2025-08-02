"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _axios = _interopRequireDefault(require("axios"));
var _dotenv = _interopRequireDefault(require("dotenv"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
_dotenv.default.config();
const tokenMelhor = () => {
  const data = {
    grant_type: 'authorization_code',
    client_id: process.env.CLIENT_ID_ME,
    client_secret: process.env.CLIENT_SECRET_ME,
    redirect_uri: 'https://backend-cidadeclipse.vercel.app/',
    code: process.env.CODE_ME
  };
  const config = {
    method: 'POST',
    url: 'https://sandbox.melhorenvio.com.br/oauth/token',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'User-Agent': 'Aplicação lucasleaolima@gmail.com'
    },
    data: data
  };
  (0, _axios.default)(config).then(res => {
    console.log(res);
  }).catch(err => {
    console.log(err);
  });
};
tokenMelhor();
var _default = exports.default = tokenMelhor;