import { listChats, renameChat as apiRenameChat, deleteChat as apiDeleteChat } from '../services/chat.service'

const CACHE_TTL = 1000 * 60 * 2 // 2 min

let cachedChats = null
let lastFetch = 0
let pendingPromise = null

const listeners = new Set()

function notify() {
  listeners.forEach((listener) => listener(cachedChats))
}

export function subscribe(listener) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export function getCachedChats() {
  return cachedChats
}

export async function fetchChats({ force = false } = {}) {
  const now = Date.now()

  if (!force && cachedChats && now - lastFetch < CACHE_TTL) {
    return cachedChats
  }

  if (pendingPromise) return pendingPromise

  pendingPromise = listChats()
    .then((data) => {
      cachedChats = data
      lastFetch = Date.now()
      notify()
      return data
    })
    .finally(() => {
      pendingPromise = null
    })

  return pendingPromise
}

export function upsertChatLocal(chat) {
  if (!cachedChats) return

  const index = cachedChats.findIndex((c) => c.id === chat.id)
  cachedChats =
    index === -1
      ? [chat, ...cachedChats]
      : cachedChats.map((c, i) => (i === index ? { ...c, ...chat } : c))

  notify()
}

export async function renameChatCached(chatId, title) {
  const previous = cachedChats

  if (cachedChats) {
    cachedChats = cachedChats.map((c) => (c.id === chatId ? { ...c, title } : c))
    notify()
  }

  try {
    await apiRenameChat(chatId, title)
  } catch (err) {
    cachedChats = previous
    notify()
    throw err
  }
}

export async function deleteChatCached(chatId) {
  const previous = cachedChats

  if (cachedChats) {
    cachedChats = cachedChats.filter((c) => c.id !== chatId)
    notify()
  }

  try {
    await apiDeleteChat(chatId)
  } catch (err) {
    cachedChats = previous
    notify()
    throw err
  }
}

export function clearChatsCache() {
  cachedChats = null
  lastFetch = 0
  notify()
}