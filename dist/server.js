"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _express = _interopRequireDefault(require("express"));
var _dotenv = _interopRequireDefault(require("dotenv"));
var _helmet = _interopRequireDefault(require("helmet"));
var _cors = _interopRequireDefault(require("cors"));
var _expressRateLimit = _interopRequireDefault(require("express-rate-limit"));
var _emailRoutes = _interopRequireDefault(require("./routes/emailRoute/emailRoutes.js"));
var _csrfToken = _interopRequireDefault(require("./routes/tokenGeneration/csrfToken.js"));
var _publickBooks = _interopRequireDefault(require("./routes/books/publickBooks.js"));
var _storeBooks = _interopRequireDefault(require("./routes/books/storeBooks.js"));
var _createUser = _interopRequireDefault(require("./routes/user/createUser.js"));
var _login = _interopRequireDefault(require("./routes/user/login.js"));
var _profile = _interopRequireDefault(require("./routes/user/profile.js"));
var _logout = _interopRequireDefault(require("./routes/user/logout.js"));
var _cookieParser = _interopRequireDefault(require("cookie-parser"));
var _addToCart = _interopRequireDefault(require("./routes/cart/addToCart.js"));
var _cartItems = _interopRequireDefault(require("./routes/cart/cartItems.js"));
var _removeItem = _interopRequireDefault(require("./routes/cart/removeItem.js"));
var _updatePrice = _interopRequireDefault(require("./routes/cart/updatePrice.js"));
var _getTotalPrice = _interopRequireDefault(require("./routes/cart/getTotalPrice.js"));
var _addPurchase = _interopRequireDefault(require("./routes/checkout/addPurchase.js"));
var _confirm = _interopRequireDefault(require("./routes/user/confirm.js"));
var _path = _interopRequireDefault(require("path"));
var _url = require("url");
var _authToken = _interopRequireDefault(require("./routes/auth/authToken.js"));
var _cleanUserNotVerified = _interopRequireDefault(require("./deleteUser/cleanUserNotVerified.js"));
var _purchaseCompleted = _interopRequireDefault(require("./routes/user/purchaseCompleted.js"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
_dotenv["default"].config();
var _filename = (0, _url.fileURLToPath)(import.meta.url);
var _dirname = _path["default"].dirname(_filename);
var app = (0, _express["default"])();
var PORT = process.env.PORT || 9001;
app.use(_express["default"]["static"](_path["default"].join(_dirname, '..', 'public')));
app.use(_express["default"].json());
app.use((0, _helmet["default"])());
app.use((0, _cookieParser["default"])());
app.use(_helmet["default"].contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'"],
    scriptSrc: ["'self'"],
    styleSrc: ["'self'"],
    imgSrc: ["'self'"],
    connectSrc: ["'self'"],
    frameSrc: ["'none'"],
    objectSrc: ["'none'"],
    baseUri: ["'self'"],
    formAction: ["'self'"]
  }
}));
var allowedOrigins = process.env.ALLOWED_ORIGINS.split(',');
app.use((0, _cors["default"])({
  origin: function origin(_origin, callback) {
    if (!_origin || allowedOrigins.indexOf(_origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: 'GET,POST,OPTIONS,DELETE,PATCH',
  allowedHeaders: ['Content-Type', 'CSRF-Token', 'authorization'],
  credentials: true
}));
var sendDataLimiter = (0, _expressRateLimit["default"])({
  windowMs: 10 * 60 * 1000,
  max: 20,
  message: 'Muitas requisições deste IP, por favor tente novamente mais tarde'
});
app.use('/books', _publickBooks["default"]);
app.use('/', _storeBooks["default"]);
app.use('/email', sendDataLimiter, _emailRoutes["default"]);
app.use('/auth', _csrfToken["default"]);

// user
app.use('/', _createUser["default"]);
app.use('/', _login["default"]);
app.use('/', _profile["default"]);
app.use('/', _logout["default"]);
app.use('/', _confirm["default"]);
app.use('/', _addToCart["default"]);
app.use('/', _updatePrice["default"]);
app.use('/', _cartItems["default"]);
app.use('/', _removeItem["default"]);
app.use('/', _getTotalPrice["default"]);
app.post('/cleanupUsers', _cleanUserNotVerified["default"]);
app.use('/', _addPurchase["default"]);
app.use('/', _purchaseCompleted["default"]);

// Check token
app.use('/getCookie', _authToken["default"], function (req, res) {
  res.status(200).json({
    msg: 'Conexão válida'
  });
});
if (process.env.DEPLOY !== 'vercel') {
  app.listen(PORT, function () {
    console.log("Running on Port ".concat(PORT));
  });
}
var _default = exports["default"] = app;