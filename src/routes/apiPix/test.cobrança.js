import axios from "axios"
import https from 'https'
import fs from 'fs'

const data = {
    "calendario": {
        "expiracao": 3600
    },
    "devedor": {
        "cpf": "08238760399",
        "nome": "Lucas Leao Lima"
    },
    "valor": {
        "original": "5.00"
    },
    "chave": "e6ab7dd0-5cd9-4370-939c-5f258bdad648",
    "solicitacaoPagador": "Cobrança dos serviços prestados."
}

const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0eXBlIjoiYWNjZXNzX3Rva2VuIiwiY2xpZW50SWQiOiJDbGllbnRfSWRfYjU4OTU5Zjc3NGU4MWRlZDE2ZDc1ZDAwOGUzN2ZkMWE1NDMxY2U2NyIsImFjY291bnQiOjY1OTcyOSwiYWNjb3VudF9jb2RlIjoiY2VlNDZiNTYzYWMzMzZhNDY1MzFlZTAzNWE1ZDkzODgiLCJzY29wZXMiOlsiY29iLnJlYWQiLCJjb2Iud3JpdGUiLCJjb2J2LnJlYWQiLCJjb2J2LndyaXRlIiwiZ24uYmFsYW5jZS5yZWFkIiwiZ24uaW5mcmFjdGlvbnMucmVhZCIsImduLmluZnJhY3Rpb25zLndyaXRlIiwiZ24ub3BiLmNvbmZpZy5yZWFkIiwiZ24ub3BiLmNvbmZpZy53cml0ZSIsImduLm9wYi5wYXJ0aWNpcGFudHMucmVhZCIsImduLm9wYi5wYXltZW50LnBpeC5jYW5jZWwiLCJnbi5vcGIucGF5bWVudC5waXgucmVhZCIsImduLm9wYi5wYXltZW50LnBpeC5yZWZ1bmQiLCJnbi5vcGIucGF5bWVudC5waXguc2VuZCIsImduLnBpeC5ldnAucmVhZCIsImduLnBpeC5ldnAud3JpdGUiLCJnbi5waXguc2VuZC5yZWFkIiwiZ24ucXJjb2Rlcy5wYXkiLCJnbi5yZXBvcnRzLnJlYWQiLCJnbi5yZXBvcnRzLndyaXRlIiwiZ24uc2V0dGluZ3MucmVhZCIsImduLnNldHRpbmdzLndyaXRlIiwiZ24uc3BsaXQucmVhZCIsImduLnNwbGl0LndyaXRlIiwibG90ZWNvYnYucmVhZCIsImxvdGVjb2J2LndyaXRlIiwicGF5bG9hZGxvY2F0aW9uLnJlYWQiLCJwYXlsb2FkbG9jYXRpb24ud3JpdGUiLCJwaXgucmVhZCIsInBpeC5zZW5kIiwicGl4LndyaXRlIiwid2ViaG9vay5yZWFkIiwid2ViaG9vay53cml0ZSJdLCJleHBpcmVzSW4iOjM2MDAsImNvbmZpZ3VyYXRpb24iOnsieDV0I1MyNTYiOiI1blRzbDRVZ0ZZWHBwZDZkd3MwRDdMMnpZL0xSSGpPTncwTUxxV1BpMHc4PSJ9LCJpYXQiOjE3MzM1Mjg3OTcsImV4cCI6MTczMzUzMjM5N30.zxFppGeh6NPoU1Wc3YuBJR5-crfHN5ZPtRMkhov9-OU'
const certificado = fs.readFileSync('./src/routes/certificado/producao-659729-Test_CD.p12')

const agent = new https.Agent({
    pfx: certificado,
    passphrase: ''
})

const config = {
    method: 'DELETE',
    url: 'https://pix.api.efipay.com.br/v2/cob/4ba1dfd626094ee585aca590dd939ed4',
    headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
    },
    httpsAgent: agent,
    data
}

axios(config).then(res => console.log(res.data)).catch(err => console.log(err))
