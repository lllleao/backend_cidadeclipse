import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient

const createPurchase = (userId, buyerName, buyerAddress, buyerCPF, totalPrice, items) => {
    return new Promise((resolve, reject) => {
        prisma.purchase.create({
            data: {
                buyerAddress,
                buyerCPF,
                buyerName,
                totalPrice: parseFloat(totalPrice),
                createdAt: new Date(),
                userId,
            }
        }).then(orderData => {
            prisma.purchaseItem.createMany({
                data: items.map(({name, quant, price, photo}) => {
                    return {
                        name,
                        quant,
                        price: parseFloat(price),
                        photo,
                        purchaseId: orderData.id
                    }
                })
            }).catch(err => {
                reject(err)
            })
        }).catch(err => {
            reject(err)
        })
    })
}

export default createPurchase
