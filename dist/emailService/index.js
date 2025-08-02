"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _nodemailer = _interopRequireDefault(require("nodemailer"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const transporter = _nodemailer.default.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});
const sendEmailVerified = async (userEmail, userId, token) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: userEmail,
    subject: 'Confirmação de email',
    html: `<h2>Clique no link para confirmar seu email: <a href="http://localhost:9001/confirm?token=${token}&userId=${userId}">Confirmar Email</a></h2>`
  };
  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email enviado');
  } catch (err) {
    console.log('Email não enviado', err);
  }
};
var _default = exports.default = sendEmailVerified;