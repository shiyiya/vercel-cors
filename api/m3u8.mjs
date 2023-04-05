import fetch from 'node-fetch'
import path from 'node:path'

const handler = (req, res) => {
  const url = decodeURI(req.query.url)
  const urlPrefix = url.substring(0, url.lastIndexOf('/'))
  fetch(url, {
    method: req.method,
    body: req.body,
    headers: {}
  })
    .then(async (result) => {
      const ext = path.extname(url)
      let resp = await result.text()

      if (ext == '.m3u8') {
        resp = resp.replaceAll(/\n(.*\.m3u8)/g, (sub) => {
          return `\nhttps://cors-flame.vercel.app/api/m3u8?url=${urlPrefix}${sub.trimLeft()}`
        })

        resp = resp.replaceAll(/\n(.*\.ts)/g, (sub) => {
          return `\nhttps://cors-flame.vercel.app/api/m3u8?url=${urlPrefix}${sub.trimLeft()}`
        })
      }

      return resp
    })
    .then(res.send)
    .catch(res.send)
}

export default handler
