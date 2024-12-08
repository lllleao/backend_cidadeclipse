import express from 'express'
import https from 'https'
import fs from 'fs'
import axios from 'axios'
import dotenv from 'dotenv'

dotenv.config()

const certificado = fs.readFileSync('./src/routes/certificado/producao-659729-Test_CD.p12')

const credenciais = {
    client_id: process.env.CLIENT_ID,
    client_secret: process.env.CLIENT_SECRET
}

const data = JSON.stringify({grant_type: "client_credentials"})
const data_credentials = credenciais.client_id + ':' + credenciais.client_secret

const auth = Buffer.from(data_credentials).toString("base64")

const agent = new https.Agent({
    pfx: certificado,
    passphrase: ''
})

const config = {
    method: 'POST',
    url: 'https://pix.api.efipay.com.br/oauth/token',
    headers: {
        Authorization: 'Basic ' + auth,
        'Content-Type': 'application/json'
    },
    httpsAgent: agent,
    data: data
}

axios(config).then(res => console.log(res.data)).catch(err => console.log(err))
