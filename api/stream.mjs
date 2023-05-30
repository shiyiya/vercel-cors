// export default async function handler(req) {
//   const url = decodeURI(req.query.url)
//   const res = await fetch(url, { method: req.method, body: req.body, headers: {} })

//   return new Response(res.body, {
//     status: res.status,
//     statusText: res.statusText,
//     headers: res.headers
//   })
// }

import express from 'express'
import request from 'request'

// https://vercel.com/guides/using-express-with-vercel

const app = express()

app.get('/api/stream', (req, res) => {
  request(req.query.url)
    .on('error', function (err) {
      console.error(err)
    })
    .pipe(res)
})

// app.get('*', (req, res) => {
//   res.send('https://github.com/shiyiya/vercel-cors')
// })

export default app
