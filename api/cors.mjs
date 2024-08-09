import fetch from 'node-fetch'

const handler = async (req, res) => {
  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }

  try {
    const result = await fetch(decodeURI(req.query.url), {
      method: req.method,
      body: req.body,
      headers: {},
    })

    if (result.status === 200) {
      res.status(result.status).send(result.body)
    } else {
      res.status(result.status).send(result.statusText)
    }
  } catch (error) {
    res.status(400).send('Bad Request' + error)
  }
}

export default handler
