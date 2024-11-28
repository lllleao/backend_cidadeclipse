import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient()

export const getBooksPublic = async () => {
    const publicBooksDate = await prisma.publicLib.findMany({}).then(res => res).then(res => res).catch(err => console.log('Opa', err)).finally(() => prisma.$disconnect())

    return publicBooksDate
}

export const getBooksStore = async (id) => {
    if (!id) {
        const storeBooksDate = await prisma.store_lib.findMany({}).then(res => res).then(res => res).catch(err => console.log('Error', err)).finally(() => prisma.$disconnect())
    
        return storeBooksDate
    }

    const storeBooksDate = await prisma.store_lib.findUniqueOrThrow({
        where: {id: id}
    }).then(res => res).catch(err => console.log('Error', err)).finally(() => prisma.$disconnect())
    
    return storeBooksDate
}
