"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var cpfValidator = function cpfValidator(cpf) {
  cpf = cpf.replace(/\D/g, '');
  if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) {
    return false; // Verifica se todos os dígitos são iguais (ex.: "111.111.111-11")
  }
  var sum, remainder;

  // Validação do primeiro dígito
  sum = 0;
  for (var i = 0; i < 9; i++) {
    sum += parseInt(cpf[i]) * (10 - i);
  }
  remainder = sum * 10 % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cpf[9])) return false;

  // Validação do segundo dígito
  sum = 0;
  for (var _i = 0; _i < 10; _i++) {
    sum += parseInt(cpf[_i]) * (11 - _i);
  }
  remainder = sum * 10 % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cpf[10])) return false;
  return true;
};
var _default = exports["default"] = cpfValidator;