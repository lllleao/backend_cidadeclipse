import axios from 'axios'
import dotenv from 'dotenv'

dotenv.config()

const tokenMelhor = () => {
    const data = {
        grant_type: 'authorization_code',
        client_id: process.env.CLIENT_ID_ME,
        client_secret: process.env.CLIENT_SECRET_ME,
        redirect_uri: 'https://backend-cidadeclipse.vercel.app/',
        code: process.env.CODE_ME
    }
    const config = {
        method: 'POST',
        url: 'https://sandbox.melhorenvio.com.br/oauth/token',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'User-Agent': 'Aplicação lucasleaolima@gmail.com'
        },
        data: data
    }
    axios(config).then(res => {
        console.log(res)
    }).catch(err => {
        console.log(err)
    })
}
tokenMelhor()
export default tokenMelhor
