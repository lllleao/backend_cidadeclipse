import csrf from 'csrf'
const tokens = new csrf()

export function csrfCheck(req, res, next) {
    const tokenFromHeader = req.headers['csrf-token']

    if (tokenFromHeader && tokens.verify(process.env.CSRF_SECRET, tokenFromHeader)) {
        next()
    } else {
        res.status(403).json({ message: 'CSRF token invalid or not found' })
    }
}

export function generateCsrfToken() {
    return tokens.create(process.env.CSRF_SECRET)
}
