import express from "express"

const router = express.Router()

router.get('/logout', (req, res) => {
    const token = req.cookies
    res.clearCookie('token')
    res.json({msg: 'Logout realizado'})
})

export default router
