import { useState, useCallback, useRef } from 'react'
import { sendMessage as apiSendMessage, getChat } from '../services/chat.service'
import { upsertChatLocal } from '../stores/chat.store'

export function useChat(initialChatId = null) {
  const [chatId, setChatId] = useState(initialChatId)
  const [messages, setMessages] = useState([])
  const [isStreaming, setIsStreaming] = useState(false)
  const [error, setError] = useState(null)
  const abortRef = useRef(null)

  const loadChat = useCallback(async (id) => {
    const data = await getChat(id)
    setChatId(data.id)
    setMessages(Array.isArray(data.chat) ? data.chat : [])
    return data
  }, [])

  const sendMessage = useCallback(async (text) => {
    setError(null)
    setIsStreaming(true)

    const controller = new AbortController()
    abortRef.current = controller
    let currentChatId = chatId

    setMessages((prev) => [
      ...prev,
      { role: 'user', content: text, created_at: new Date().toISOString() },
      { role: 'assistant', content: '', created_at: new Date().toISOString() },
    ])

    try {
      await apiSendMessage({
        chatId: currentChatId,
        message: text,
        signal: controller.signal,
        onChatId: (id) => {
          currentChatId = id
          setChatId(id)
          upsertChatLocal({ id, title: null, created_at: new Date().toISOString() })
        },
        onToken: (token) => {
          setMessages((prev) => {
            const next = [...prev]
            const last = next[next.length - 1]
            next[next.length - 1] = { ...last, content: last.content + token }
            return next
          })
        },
        onTitle: (title) => {
          if (currentChatId) upsertChatLocal({ id: currentChatId, title })
        },
        onError: (err) => {
          throw err
        },
      })
    } catch (err) {
      if (err.name !== 'AbortError') setError(err.message || 'Falha ao enviar a mensagem.')
    } finally {
      setIsStreaming(false)
      abortRef.current = null
    }
  }, [chatId])

  const stop = useCallback(() => {
    abortRef.current?.abort()
  }, [])

  return { chatId, messages, isStreaming, error, sendMessage, loadChat, stop }
}