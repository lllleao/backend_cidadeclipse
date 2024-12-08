import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient

const createPurchase = async (userId, buyerName, buyerAddress, buyerCPF, totalPrice, items) => {
    // console.log(userId, buyerAddress, buyerName, buyerCPF, totalPrice, items)

    const purchase = await prisma.$transaction(async (prisma) => {
        const newPurchase = await prisma.purchase.create({
            data: {
                userId,
                buyerName,
                buyerAddress,
                buyerCPF,
                totalPrice
            }
        })

        const itemsData = items.map((item) => ({
            name: item.name,
            photo: item.photo,
            price: item.price,
            quant: item.quant,
            purchaseId: newPurchase.userId,
        }));

        await prisma.itemInfo.createMany({
            data: itemsData
        })

        return newPurchase
    })
    return purchase
}

export default createPurchase
