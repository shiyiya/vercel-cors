//@ts-nocheck
import express from 'express'
import fetch from 'node-fetch'

const app = express()

// https://github.com/SocialSisterYi/bilibili-API-collect

app.get('/api/bilibili/:tag/:p?', async (req, res) => {
  if (req.params.tag == 'danmaku') {
    return fetchBilibiliDanmakuXML(req, res)
  }

  const { tag, p = 0 } = req.params
  const id = tag.substring(2)

  // anime https://github.com/SocialSisterYi/bilibili-API-collect/blob/master/docs/bangumi/info.md#%E8%8E%B7%E5%8F%96%E5%89%A7%E9%9B%86%E6%98%8E%E7%BB%86web%E7%AB%AFssidepid%E6%96%B9%E5%BC%8F
  if (tag.startsWith('ep')) {
    // https://api.bilibili.com/pgc/view/web/season?ep_id=508404
    const { message, code, result: data } = await (await fetch('https://api.bilibili.com/pgc/view/web/season?ep_id=' + id)).json()
    if (code != 0) return res.send({ message, code })

    const { aid, bvid, cid } = data.episodes[p]

    res.send({
      ...data,
      // video
      // https://api.bilibili.com/pgc/player/web/playurl?avid=641107054&cid=785726095&qn=1&type=&otype=json&platform=html5&high_quality=1
      ...(
        await fetch(
          `https://api.bilibili.com/pgc/player/web/playurl?avid=${aid}&cid=${cid}&qn=1&type=&otype=json&platform=html5&high_quality=1`,
          {
            headers: {
              referer: `https://www.bilibili.com/bangumi/play/${tag}`,
              'user-agent':
                'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36 Edg/111.0.1661.62',
            },
          }
        ).then((_) => _.json())
      ).result,

      // thumnails
      // https://api.bilibili.com/x/player/videoshot?bvid=1Ce411V7cX&cid=874196065
      ...(await (await fetch(`https://api.bilibili.com/x/player/videoshot?bvid=${bvid}&cid=${cid}`)).json()).data,

      // https://api.bilibili.com/x/v1/dm/list.so?oid=874196065
      // danmakuXML: await (await fetch(`https://api.bilibili.com/x/v1/dm/list.so?oid=${cid}`)).text(),
    })
  } else {
    // http://api.bilibili.com/x/web-interface/view?bvid=1DP411y7RS
    const { message, code, data } = await (await fetch('http://api.bilibili.com/x/web-interface/view?bvid=' + id)).json()
    if (code != 0) return res.send({ message, code })

    res.send({
      ...data,
      // video
      // https://api.bilibili.com/x/player/playurl?avid=313274069&cid=1118156572&qn=1&type=&otype=json&platform=html5&high_quality=1
      ...(
        await fetch(
          `https://api.bilibili.com/x/player/playurl?avid=${data.aid}&cid=${data.cid}&qn=1&type=&otype=json&platform=html5&high_quality=1`
        ).then((_) => _.json())
      ).data,

      // thumnails
      // https://api.bilibili.com/x/player/videoshot?bvid=1DP411y7RS&cid=1118156572
      ...(await (await fetch(`https://api.bilibili.com/x/player/videoshot?bvid=${data.bvid}&cid=${data.cid}`)).json()).data,

      // https://api.bilibili.com/x/v1/dm/list.so?oid=1118156572
      // danmakuXML: await (await fetch(`https://api.bilibili.com/x/v1/dm/list.so?oid=${cid}`)).text(),

      // subtitle
      // https://api.bilibili.com/x/player/v2?aid=951967962&cid=1081397530&ep_id=736258&season_id=43622
      // ...(await (await fetch(`https://api.bilibili.com/x/player/v2?avid=${data.aid}&cid=${data.cid}`)).json()).data,
    })
  }
})

async function fetchBilibiliDanmakuXML(req, res) {
  const cid = req.params.p
  res.type('application/xml')
  res.send(await (await fetch(`https://api.bilibili.com/x/v1/dm/list.so?oid=${cid}`)).text())
}

app.get('*', (req, res) => {
  res.send('https://github.com/shiyiya/vercel-cors')
})

export default app
