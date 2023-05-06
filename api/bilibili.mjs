//@ts-nocheck
import express from 'express'
import fetch from 'node-fetch'

const app = express()

app.get('/api/bilibili/:vid/:p?', async (req, res) => {
  const { message, code, data } = await (await fetch('http://api.bilibili.com/x/web-interface/view?bvid=' + req.params.vid)).json()
  if (code != 0) return res.send({ message, code, data })

  res.send({
    ...(await (await fetch(`https://api.bilibili.com/x/player/playurl?avid=${data.aid}&cid=${data.cid}&qn=1&type=&otype=json&platform=html5&high_quality=1`)).json()),
    ...(await (await fetch(`https://api.bilibili.com/x/player/videoshot?bvid=${data.bvid}&cid=${data.cid}`)).json()).data,
  })

  // axios("http://api.bilibili.com/archive_stat/stat?aid="+resp.data.aid+"&type=jsonp")
})

app.get('*', (req, res) => {
  res.send('https://github.com/shiyiya/vercel-cors')
})

export default app
