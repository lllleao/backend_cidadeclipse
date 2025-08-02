"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getBooksStore = exports.getBooksPublic = void 0;
var _client = require("@prisma/client");
const prisma = new _client.PrismaClient();
const getBooksPublic = async () => {
  const publicBooksDate = await prisma.public_book.findMany({}).then(res => res).then(res => res).catch(err => console.log(err)).finally(() => prisma.$disconnect());
  return publicBooksDate;
};
exports.getBooksPublic = getBooksPublic;
const getBooksStore = async id => {
  if (!id) {
    const storeBooksDate = await prisma.store_book.findMany({}).then(res => res).then(res => res).catch(err => console.log('Error', err)).finally(() => prisma.$disconnect());
    return storeBooksDate;
  }
  const storeBooksDate = await prisma.store_book.findUniqueOrThrow({
    where: {
      id: id
    },
    include: {
      store_books_credits: true
    }
  }).then(res => res).catch(err => console.log('Error', err)).finally(() => prisma.$disconnect());
  return storeBooksDate;
};
exports.getBooksStore = getBooksStore;