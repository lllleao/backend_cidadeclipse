"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _express = _interopRequireDefault(require("express"));
var _bcrypt = _interopRequireDefault(require("bcrypt"));
var _client = require("@prisma/client");
var _expressValidator = require("express-validator");
var _index = require("../../tokenService/index.js");
var _index2 = _interopRequireDefault(require("../../emailService/index.js"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i["return"]) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, _regeneratorDefine2(e, r, n, t); }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
var router = _express["default"].Router();
var prisma = new _client.PrismaClient();
var loginValidatorSign = [(0, _expressValidator.body)('email').isEmail().trim().notEmpty().withMessage('Por favor, forneça um email válido'), (0, _expressValidator.body)('name').notEmpty().trim().escape().withMessage('Por favor, forneça um nome válido'), (0, _expressValidator.body)('password').notEmpty().withMessage('Senha é obrigatória')];
router.post('/create', loginValidatorSign, /*#__PURE__*/function () {
  var _ref = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee(req, res) {
    var erros, _req$body, name, email, password, tokenLogado;
    return _regenerator().w(function (_context) {
      while (1) switch (_context.n) {
        case 0:
          erros = (0, _expressValidator.validationResult)(req);
          _req$body = req.body, name = _req$body.name, email = _req$body.email, password = _req$body.password;
          tokenLogado = req.cookies.token;
          if (!tokenLogado) {
            _context.n = 1;
            break;
          }
          return _context.a(2, res.status(400).json({
            msg: 'Cadastro já realizado'
          }));
        case 1:
          if (erros.isEmpty()) {
            _context.n = 2;
            break;
          }
          return _context.a(2, res.status(400).json({
            msg: 'Credenciais incorretas'
          }));
        case 2:
          _bcrypt["default"].genSalt(10).then(function (salt) {
            return _bcrypt["default"].hash(password, salt);
          }).then(function (hashPassword) {
            prisma.user_cd.findUnique({
              where: {
                email: email
              }
            }).then(function (user) {
              if (user) {
                return res.status(400).json({
                  msg: user.email,
                  userId: user.id,
                  signUserExist: false
                });
              }
              return prisma.user_cd.create({
                data: {
                  email: email,
                  passwordUser: hashPassword,
                  name: name,
                  isVerified: false
                }
              }).then(function (user) {
                prisma.cart.create({
                  data: {
                    totalPrice: 0,
                    userId: user.id,
                    emailUser: email
                  }
                })["catch"](function (err) {
                  console.log(err);
                  return res.status(400).json({
                    msg: 'Carrinho não criado'
                  });
                });
                return (0, _index.generateJWTToken)(user).then(function (token) {
                  prisma.user_cd.update({
                    where: {
                      id: user.id
                    },
                    data: {
                      token: token
                    }
                  }).then(function () {
                    res.status(201).json({
                      msg: 'deu bom',
                      signSuccess: true
                    });
                    return (0, _index2["default"])(user.email, user.id, token);
                  })["catch"](function (err) {
                    return console.log('Erro ao atualizar o usuário', err);
                  });
                })["catch"](function (err) {
                  return console.log('Token não gerado', err);
                });
              });
            });
          })["catch"](function (err) {
            console.log(err, 'Caiu aqui');
            res.status(500).json({
              msg: 'Erro no servidor, tente novamente'
            });
          });
        case 3:
          return _context.a(2);
      }
    }, _callee);
  }));
  return function (_x, _x2) {
    return _ref.apply(this, arguments);
  };
}());
var _default = exports["default"] = router;