const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000'

async function request(path, { method = 'GET', body, headers } = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: { 'Content-Type': 'application/json', ...(headers || {}) },
    credentials: 'include',
    body: body ? JSON.stringify(body) : undefined
  })
  if (!res.ok) {
    let msg = 'Request failed'
    try { const j = await res.json(); msg = j.message || msg } catch {}
    throw new Error(msg)
  }
  const contentType = res.headers.get('content-type') || ''
  if (contentType.includes('application/json')) return res.json()
  return res.text()
}

async function upload(path, file) {
  const form = new FormData()
  form.append('file', file)
  const res = await fetch(`${BASE_URL}${path}` , {
    method: 'POST',
    body: form,
    credentials: 'include'
  })
  if (!res.ok) {
    let msg = 'Upload failed'
    try { const j = await res.json(); msg = j.message || msg } catch {}
    throw new Error(msg)
  }
  return res.json()
}

export const api = {
  get: (p) => request(p),
  post: (p, b) => request(p, { method: 'POST', body: b }),
  put: (p, b) => request(p, { method: 'PUT', body: b }),
  del: (p) => request(p, { method: 'DELETE' }),
  upload
}
