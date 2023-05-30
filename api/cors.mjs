import fetch from 'node-fetch'

const handler = async (req, res) => {
  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }

  console.log(req.get('Referrer'))

  try {
    const result = await fetch(decodeURI(req.query.url), {
      method: req.method,
      body: req.body,
      headers: {},
    })

    const contentType = result.headers.get('content-type')

    if (contentType && ['image', 'video', 'file'].includes(contentType.split('/')[0])) {
      res.send(contentType)
      return
    }

    res.setHeaders(result.headers)
    // res.setHeader('content-type', contentType)

    let resp
    if (contentType?.includes('json')) {
      resp = await result.json()
    } else {
      resp = await result.text()
    }

    res.send(resp)
  } catch (error) {
    res.send(error)
  }
}

export default handler
