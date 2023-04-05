import fetch from 'node-fetch'

const handler = (req, res) => {
  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }

  fetch(decodeURI(req.query.url), {
    method: req.method,
    body: req.body,
    headers: {}
  })
    .then(async (result) => {
      let resp, err

      //TODO: parse m3u8 -> add cors prefix
      try {
        resp = await result.text()
      } catch (error) {
        err = error
      }

      try {
        resp = await result.json()
      } catch (error) {
        err = error
      }

      return resp || err
    })
    .then(res.send)
    .catch((e) => res.send(e))
}

export default handler
