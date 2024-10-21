import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET

const authMiddToken = (req, res, next) => {
    const token = req.cookies.token
    if (!token) return res.status(401).json({msg: 'Token ausente, autorização negada'})
    
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
            console.log(err)
            return res.status(401).json({ msg: 'Token inválido' })
        }

        req.user = decoded.userId
        next()
    })
}

export default authMiddToken
