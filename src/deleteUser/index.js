import express from "express"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export const deleteUser = (user) => {
    prisma.user.delete({
        where: {id: user}
    }).then(() => {
        console.log('Usuario deletado')
    }).catch(err => {
        console.error(err)
    })
}
