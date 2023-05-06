import express from 'express'
import request from 'request'

// https://vercel.com/guides/using-express-with-vercel

const app = express()

app.get('/api/bilibili/:vid', async (req, res) => {
  const { data, code, message } = await request('http://api.bilibili.com/x/web-interface/view?bvid=' + req.params.vid)
  if (code != 0) return res.send({ message, code, data })

  res.send(await request(`https://api.bilibili.com/x/player/playurl?avid=${data.aid}&cid=${data.cid}&qn=1&type=&otype=json&platform=html5&high_quality=1`))

  // axios("http://api.bilibili.com/archive_stat/stat?aid="+resp.data.aid+"&type=jsonp")
})

app.get('*', (req, res) => {
  res.send('https://github.com/shiyiya/vercel-cors')
})

export default app
