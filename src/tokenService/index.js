import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET

export const generateJWTToken = (user) => {
    return new Promise((resolve, reject) => {
        const payload = {
            email: user.email,
            userId: user.id
        }

        const expires = { expiresIn: '20m' }

        jwt.sign(payload, JWT_SECRET, expires, (err, token) => {
            if (err) {
                console.log(err, 'expirado')
                return reject(err)
            }
            resolve(token)
        })
    })
}

export const verifyEmailToken = (token) => {
    return new Promise((resolve, reject) => {
        jwt.verify(token, JWT_SECRET, (err, decoded) => {
            if (err) {
                console.log('dentro')
                reject(err)
            }

            resolve(decoded)
        })
    })
}
