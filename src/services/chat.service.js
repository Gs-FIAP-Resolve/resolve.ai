const BASE_URL = 'https://api-airesolve.vercel.app/api/chat'

async function parseJson(res) {
  try {
    return await res.json()
  } catch {
    return null
  }
}

export async function listChats() {
  const res = await fetch(BASE_URL, { credentials: 'include' })
  const data = await parseJson(res)

  if (!res.ok) throw new Error(data?.error || 'Falha ao carregar as conversas.')
  return data
}

export async function getChat(chatId) {
  const res = await fetch(`${BASE_URL}?id=${encodeURIComponent(chatId)}`, {
    credentials: 'include',
  })
  const data = await parseJson(res)

  if (!res.ok) throw new Error(data?.error || 'Falha ao carregar a conversa.')
  return data
}

export async function renameChat(chatId, title) {
  const res = await fetch(BASE_URL, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ id: chatId, title }),
  })
  const data = await parseJson(res)

  if (!res.ok) throw new Error(data?.error || 'Falha ao renomear a conversa.')
  return data
}

export async function deleteChat(chatId) {
  const res = await fetch(`${BASE_URL}?id=${encodeURIComponent(chatId)}`, {
    method: 'DELETE',
    credentials: 'include',
  })

  if (!res.ok) {
    const data = await parseJson(res)
    throw new Error(data?.error || 'Falha ao excluir a conversa.')
  }
  return true
}

export function sendMessage({ chatId, message, signal, onChatId, onToken, onTitle, onDone, onError }) {
  return fetch(BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    signal,
    body: JSON.stringify({ chatId, message }),
  }).then(async (res) => {
    if (!res.ok || !res.body) {
      const data = await parseJson(res)
      throw new Error(data?.error || 'Falha ao enviar a mensagem.')
    }

    const reader = res.body.getReader()
    const decoder = new TextDecoder()
    let buffer = ''

    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      buffer += decoder.decode(value, { stream: true })
      const chunks = buffer.split('\n\n')
      buffer = chunks.pop() ?? ''

      for (const chunk of chunks) {
        const lines = chunk.split('\n')
        const eventLine = lines.find((l) => l.startsWith('event:'))
        const dataLine = lines.find((l) => l.startsWith('data:'))
        if (!eventLine || !dataLine) continue

        const event = eventLine.slice(6).trim()
        const payload = JSON.parse(dataLine.slice(5).trim())

        if (event === 'chat_id') onChatId?.(payload.chatId)
        else if (event === 'token') onToken?.(payload.content)
        else if (event === 'title') onTitle?.(payload.title)
        else if (event === 'done') onDone?.(payload)
        else if (event === 'error') onError?.(new Error(payload.message))
      }
    }
  })
}