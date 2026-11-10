import '../css/login.css'
import logo from '../assets/svg/logo-dark.svg'
import { Link } from 'react-router-dom'
import { Close } from '@carbon/icons-react'

const Login = () => {
    return (
        <main className="login-main">
            <section className='login-content'>
                <header className='login-content-header'>
                    <img src={logo} alt="Resolve logo" />
                    <Link><Close size={20} /></Link>
                </header>
                <section className='login-content-input'>
                    <article className='login-input'>
                        <h1>Email</h1>
                        <div>
                            <input type='email' placeholder="Entre com seu email" />
                        </div>
                    </article>

                    <article className='login-input'>
                        <h1>Senha</h1>
                        <div>
                            <input type='password' placeholder="Entre com a sua senha" />
                        </div>
                    </article>

                    <article className='login-content-input-actions'>
                        <div>
                            <input type="checkbox" />
                            Lembrar de mim
                        </div>

                        <Link>Esqueci minha senha</Link>
                    </article>

                    <button className='login-confirm-btn'>Continuar</button>

                    <div className='login-divider'>
                        <hr />
                        ou continue com
                        <hr />
                    </div>

                    <article className='login-oauths'>
                        <Link>
                            <img src="https://thumb.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/3840px-Google_%22G%22_logo.svg.png?utm_source=pt.wikipedia.org&utm_campaign=index&utm_content=thumbnail" />
                        </Link>
                        <Link>
                            <img src="https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg?utm_source=pt.wikipedia.org&utm_campaign=index&utm_content=original" />
                        </Link>
                        <Link>
                            <img src="https://thumb.wikimedia.org/wikipedia/commons/thumb/b/b9/2023_Facebook_icon.svg/3840px-2023_Facebook_icon.svg.png?utm_source=pt.wikipedia.org&utm_campaign=index&utm_content=thumbnail" />
                        </Link>
                    </article>

                    <Link className='login-change-view'>Não tem uma conta? <span>Criar uma.</span></Link>
                </section>
            </section>
        </main>
    )
}

export default Login
