import { Link, useNavigate, useParams } from 'react-router-dom'
import { useEffect, useRef, useState, useMemo, useCallback } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import '../css/chat.css'
import { ArrowUp, ChevronLeft, CheckmarkFilled } from '@carbon/icons-react'
import { useChat } from '../hooks/useChat'
import { subscribe as subscribeChats } from '../stores/chat.store'

const CARD_REGEX = /<card>([\s\S]*?)<\/card>/g

function extractTag(block, tag) {
    const match = block.match(new RegExp(`<${tag}>([\\s\\S]*?)</${tag}>`))
    return match ? match[1].trim() : ''
}

// ---------------------------------------------------------------------------
// Separa o texto normal dos blocos <card>, preservando a ordem de exibição.
// Um <card> ainda incompleto (chegando aos poucos via streaming) é retido até
// fechar, pra nunca piscar a tag crua na tela.
// ---------------------------------------------------------------------------
function parseAssistantContent(content) {
    const segments = []
    let lastIndex = 0
    let match

    CARD_REGEX.lastIndex = 0
    while ((match = CARD_REGEX.exec(content)) !== null) {
        if (match.index > lastIndex) {
            segments.push({ type: 'text', content: content.slice(lastIndex, match.index) })
        }
        segments.push({
            type: 'card',
            data: {
                title: extractTag(match[1], 'title'),
                description: extractTag(match[1], 'description'),
                source: extractTag(match[1], 'source'),
                url: extractTag(match[1], 'url'),
            },
        })
        lastIndex = CARD_REGEX.lastIndex
    }

    const remainder = content.slice(lastIndex)
    const pendingIndex = remainder.indexOf('<card')

    if (pendingIndex !== -1) {
        if (pendingIndex > 0) segments.push({ type: 'text', content: remainder.slice(0, pendingIndex) })
    } else if (remainder) {
        segments.push({ type: 'text', content: remainder })
    }

    return segments
}

function getHostname(url) {
    try {
        return new URL(url).hostname.replace(/^www\./, '')
    } catch {
        return url
    }
}

function GovCard({ data }) {
    if (!data.title || !data.url) return null

    return (
        <div className='gov-card'>
            <h2>{data.title}</h2>
            <hr />
            <p>{data.description}</p>
            <div className='gov-card-source'>
                Fonte oficial · {getHostname(data.url)}
                <CheckmarkFilled size={14} />
            </div>
            <a className='gov-card-btn' href={data.url} target='_blank' rel='noopener noreferrer'>
                Abrir site oficial
            </a>
        </div>
    )
}

function TypingIndicator() {
    return (
        <div className='chat-typing'>
            <span /><span /><span />
        </div>
    )
}

function AssistantMessage({ content }) {
    const segments = useMemo(() => parseAssistantContent(content), [content])

    if (segments.length === 0) return <TypingIndicator />

    return (
        <div className='chat-message-assistant'>
            {segments.map((segment, i) =>
                segment.type === 'card' ? (
                    <GovCard key={i} data={segment.data} />
                ) : (
                    <div key={i} className='chat-markdown'>
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>{segment.content}</ReactMarkdown>
                    </div>
                )
            )}
        </div>
    )
}

const Chat = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const textareaRef = useRef(null)
    const bottomRef = useRef(null)

    const { chatId, messages, isStreaming, error, sendMessage, loadChat } = useChat(id ?? null)
    const [isLoadingChat, setIsLoadingChat] = useState(!!id)
    const [headerTitle, setHeaderTitle] = useState('Novo Chat')
    const [input, setInput] = useState('')

    useEffect(() => {
        if (!id) return

        let mounted = true

        loadChat(id)
            .then((data) => {
                if (mounted) {
                    setHeaderTitle(data.title || 'Novo Chat')
                }
            })
            .catch(() => {
                if (mounted) navigate('/home')
            })
            .finally(() => {
                if (mounted) setIsLoadingChat(false)
            })

        return () => {
            mounted = false
        }
    }, [id, loadChat, navigate])

    // Mantém o título do header sincronizado assim que o modelo secundário o gera
    useEffect(() => {
        return subscribeChats((chats) => {
            if (!chats || !chatId) return
            const current = chats.find((c) => c.id === chatId)
            if (current?.title) setHeaderTitle(current.title)
        })
    }, [chatId])

    // Troca a URL de /chat para /chat/:id assim que o backend cria a conversa
    useEffect(() => {
        if (chatId && !id) navigate(`/chat/${chatId}`, { replace: true })
    }, [chatId, id, navigate])

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages])

    const handleInput = () => {
        const element = textareaRef.current
        if (!element) return
        element.style.height = 'auto'
        element.style.height = `${element.scrollHeight}px`
    }

    const handleSend = useCallback(() => {
        const text = input.trim()
        if (!text || isStreaming) return

        setInput('')
        if (textareaRef.current) textareaRef.current.style.height = 'auto'
        sendMessage(text)
    }, [input, isStreaming, sendMessage])

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSend()
        }
    }

    const isBusy = isStreaming || isLoadingChat

    return (
        <main className="chat-main">
            <header className='chat-header'>
                <Link to='/home'><ChevronLeft size={18} /></Link>
                <h1>{headerTitle}</h1>
                <div />
            </header>

            <section className='chat-content'>
                {isLoadingChat ? (
                    <div className='chat-loading'>Carregando conversa...</div>
                ) : (
                    <>
                        {messages.map((msg, i) =>
                            msg.role === 'user' ? (
                                <div key={i} className='chat-bubble-user'>{msg.content}</div>
                            ) : (
                                <AssistantMessage key={i} content={msg.content} />
                            )
                        )}
                        {error && <div className='chat-error'>{error}</div>}
                        <div ref={bottomRef} />
                    </>
                )}
            </section>

            <article className='chat-bar'>
                <textarea
                    ref={textareaRef}
                    value={input}
                    onChange={(e) => { setInput(e.target.value); handleInput() }}
                    onKeyDown={handleKeyDown}
                    rows={1}
                    placeholder='Faça uma pergunta...'
                    disabled={isBusy}
                />
                <button onClick={handleSend} disabled={isBusy || !input.trim()}>
                    <ArrowUp />
                </button>
            </article>
        </main>
    )
}

export default Chat