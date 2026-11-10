import { useState, useCallback, useMemo } from 'react'
import '../css/login.css'
import logo from '../assets/svg/logo-dark.svg'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { Close, View, ViewOff, WarningAltFilled } from '@carbon/icons-react'
import { login, register } from '../services/auth.service'
import { useUser } from '../hooks/useUser'

const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/
const NAME_REGEX = /^[A-Za-zÀ-ÖØ-öø-ÿ]+(?:\s[A-Za-zÀ-ÖØ-öø-ÿ]+)+$/

const Login = () => {
    const navigate = useNavigate()
    const [searchParams, setSearchParams] = useSearchParams()
    const { refreshUser } = useUser()
    const isRegister = searchParams.get('view') === 'register'

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [rememberMe, setRememberMe] = useState(false)
    const [touched, setTouched] = useState({ name: false, email: false, password: false })
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [apiError, setApiError] = useState('')

    const nameError = useMemo(() => {
        if (!isRegister || !touched.name) return ''
        if (name.trim().length === 0) return 'Informe seu nome completo'
        if (!NAME_REGEX.test(name.trim())) return 'Informe nome e sobrenome'
        return ''
    }, [isRegister, touched.name, name])

    const emailError = touched.email && email.length === 0
        ? 'Informe seu email'
        : touched.email && !EMAIL_REGEX.test(email)
            ? 'Informe um email válido'
            : ''

    const passwordError = touched.password && password.length === 0
        ? 'Informe sua senha'
        : isRegister && touched.password && password.length > 0 && password.length < 8
            ? 'A senha deve ter no mínimo 8 caracteres'
            : ''

    const isFormValid = useMemo(() => {
        const baseValid = EMAIL_REGEX.test(email) && password.length > 0 && (!isRegister || password.length >= 8)
        if (!isRegister) return baseValid
        return baseValid && NAME_REGEX.test(name.trim())
    }, [email, password, isRegister, name])

    const handleBlur = useCallback((field) => {
        setTouched((prev) => ({ ...prev, [field]: true }))
    }, [])

    const handleToggleView = useCallback((e) => {
        e.preventDefault()
        setTouched({ name: false, email: false, password: false })
        setApiError('')
        setSearchParams(isRegister ? {} : { view: 'register' })
    }, [isRegister, setSearchParams])

    const handleSubmit = useCallback(async (e) => {
        e.preventDefault()
        setApiError('')
        setTouched({ name: true, email: true, password: true })

        if (!isFormValid || isSubmitting) return

        setIsSubmitting(true)

        try {
            if (isRegister) {
                await register(name.trim(), email, password)
            } else {
                await login(email, password)
            }

            await refreshUser()
            navigate('/home')
        } catch (err) {
            setApiError(err.message || 'Não foi possível concluir a solicitação. Tente novamente.')
        } finally {
            setIsSubmitting(false)
        }
    }, [isFormValid, isSubmitting, isRegister, name, email, password, refreshUser, navigate])

    return (
        <main className="login-main">
            <section className='login-content'>
                <header className='login-content-header'>
                    <img src={logo} alt="Resolve logo" />
                    <Link aria-label="Fechar"><Close size={20} /></Link>
                </header>

                <form className='login-content-input' onSubmit={handleSubmit} noValidate>
                    {apiError && (
                        <div className='login-api-error' role="alert">
                            <WarningAltFilled size={16} />
                            {apiError}
                        </div>
                    )}

                    {isRegister && (
                        <article className='login-input login-input--enter'>
                            <h1>Nome</h1>
                            <div className={nameError ? 'login-input-wrapper login-input-wrapper--error' : 'login-input-wrapper'}>
                                <input
                                    type='text'
                                    placeholder="Entre com seu nome completo"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    onBlur={() => handleBlur('name')}
                                    aria-invalid={!!nameError}
                                    aria-describedby={nameError ? 'name-error' : undefined}
                                    autoComplete="name"
                                />
                            </div>
                            {nameError && <span className='login-input-error' id="name-error">{nameError}</span>}
                        </article>
                    )}

                    <article className='login-input'>
                        <h1>Email</h1>
                        <div className={emailError ? 'login-input-wrapper login-input-wrapper--error' : 'login-input-wrapper'}>
                            <input
                                type='email'
                                placeholder="Entre com seu email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                onBlur={() => handleBlur('email')}
                                aria-invalid={!!emailError}
                                aria-describedby={emailError ? 'email-error' : undefined}
                                autoComplete="email"
                            />
                        </div>
                        {emailError && <span className='login-input-error' id="email-error">{emailError}</span>}
                    </article>

                    <article className='login-input'>
                        <h1>Senha</h1>
                        <div className={passwordError ? 'login-input-wrapper login-input-wrapper--error' : 'login-input-wrapper'}>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Entre com a sua senha"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                onBlur={() => handleBlur('password')}
                                aria-invalid={!!passwordError}
                                aria-describedby={passwordError ? 'password-error' : undefined}
                                autoComplete={isRegister ? 'new-password' : 'current-password'}
                            />
                            <button
                                type="button"
                                className='login-input-toggle'
                                onClick={() => setShowPassword((prev) => !prev)}
                                aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                                tabIndex={-1}
                            >
                                {showPassword ? <ViewOff size={18} /> : <View size={18} />}
                            </button>
                        </div>
                        {passwordError && <span className='login-input-error' id="password-error">{passwordError}</span>}
                    </article>

                    {!isRegister && (
                        <article className='login-content-input-actions'>
                            <label>
                                <input
                                    type="checkbox"
                                    checked={rememberMe}
                                    onChange={(e) => setRememberMe(e.target.checked)}
                                />
                                Lembrar de mim
                            </label>

                            <Link>Esqueci minha senha</Link>
                        </article>
                    )}

                    <button
                        type='submit'
                        className='login-confirm-btn'
                        disabled={!isFormValid || isSubmitting}
                    >
                        {isSubmitting
                            ? (isRegister ? 'Criando conta...' : 'Entrando...')
                            : (isRegister ? 'Criar conta' : 'Continuar')}
                    </button>

                    <div className='login-divider'>
                        <hr />
                        ou continue com
                        <hr />
                    </div>

                    <article className='login-oauths'>
                        <Link aria-label="Continuar com Google">
                            <img src="https://thumb.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/3840px-Google_%22G%22_logo.svg.png?utm_source=pt.wikipedia.org&utm_campaign=index&utm_content=thumbnail" alt="Google" />
                        </Link>
                        <Link aria-label="Continuar com Apple">
                            <img src="https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg?utm_source=pt.wikipedia.org&utm_campaign=index&utm_content=original" alt="Apple" />
                        </Link>
                        <Link aria-label="Continuar com Facebook">
                            <img src="https://thumb.wikimedia.org/wikipedia/commons/thumb/b/b9/2023_Facebook_icon.svg/3840px-2023_Facebook_icon.svg.png?utm_source=pt.wikipedia.org&utm_campaign=index&utm_content=thumbnail" alt="Facebook" />
                        </Link>
                    </article>

                    <Link className='login-change-view' onClick={handleToggleView}>
                        {isRegister
                            ? <>Já tem uma conta? <span>Entrar.</span></>
                            : <>Não tem uma conta? <span>Criar uma.</span></>}
                    </Link>
                </form>
            </section>
        </main>
    )
}

export default Login