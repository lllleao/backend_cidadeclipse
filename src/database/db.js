import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient()

const getBooks = async () => {
    const data = await prisma.publicLib.findMany({}).then(res => res).then(res => res).catch(err => console.log('Opa', err))
    return data
}

export default getBooks
