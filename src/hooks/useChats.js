import { useEffect, useState, useCallback } from 'react'
import {
  subscribe,
  getCachedChats,
  fetchChats,
  renameChatCached,
  deleteChatCached,
  clearChatsCache,
} from '../stores/chat.store'

export function useChats() {
  const [chats, setChats] = useState(() => getCachedChats())
  const [loading, setLoading] = useState(() => !getCachedChats())
  const [error, setError] = useState(null)

  useEffect(() => subscribe(setChats), [])

  useEffect(() => {
    let mounted = true

    async function load() {
      try {
        setLoading(true)
        setError(null)
        await fetchChats()
      } catch (err) {
        if (mounted) setError(err.message)
      } finally {
        if (mounted) setLoading(false)
      }
    }

    load()
    return () => {
      mounted = false
    }
  }, [])

  const refresh = useCallback(() => fetchChats({ force: true }), [])

  const renameChat = useCallback(async (chatId, title) => {
    await renameChatCached(chatId, title)
  }, [])

  const deleteChat = useCallback(async (chatId) => {
    await deleteChatCached(chatId)
  }, [])

  return {
    chats: chats ?? [],
    loading,
    error,
    refresh,
    renameChat,
    deleteChat,
    clearCache: clearChatsCache,
  }
}