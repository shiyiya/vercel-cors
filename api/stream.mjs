export default async function handler(req) {
  const url = decodeURI(req.query.url)
  const res = await fetch(url, { method: req.method, body: req.body, headers: {} })

  return new Response(res.body, {
    status: res.status,
    statusText: res.statusText,
    headers: res.headers
  })
}
