import axios from 'axios'
import dotenv from 'dotenv'

dotenv.config()

const data = {
    from: {postal_code: '60325004'},
    to: {postal_code: '60510205'},
    package: {height: 22, width: 9, length: 17, weight: 0.5}
}

const config = {
    method: 'POST',
    url: 'https://sandbox.melhorenvio.com.br/api/v2/me/shipment/calculate',
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.ACCESS_TOKEN_ME}`,
        'User-Agent': 'Aplicação lucasleaolima@gmail.com'
    },
    data: data
}

axios(config).then(res => console.log(res)).catch(err => console.log(err))
