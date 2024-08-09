import fetch from 'node-fetch'

const handler = async (req, res) => {
  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }

  try {
    const result = await fetch(
      decodeURI(req.query.url),
      Object.assign(
        { method: req.method }
        // req.method == 'POST' && {
        //   body: req.body, //FIXME: body used already for
        // }
      )
    )

    const contentType = result.headers.get('content-type')

    if (contentType && ['image', 'video', 'file'].includes(contentType.split('/')[0])) {
      res.send(contentType)
      return
    }

    let resp
    try {
      resp = await result.json()
    } catch (error) {
      resp = await result.text()
    }

    res.send(resp)
  } catch (error) {
    res.status(400).send('Bad Request' + error)
  }
}

export default handler
