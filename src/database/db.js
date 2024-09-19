import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient()

const getBooks = async () => {
    const publicBooksDate = await prisma.publicLib.findMany({}).then(res => res).then(res => res).catch(err => console.log('Opa', err))

    const storeBooksDate = await prisma.store_lib.findMany({}).then(res => res).then(res => res).catch(err => console.log('Opa', err))

    return {
        publicBooksDate,
        storeBooksDate
    }
}

export default getBooks
