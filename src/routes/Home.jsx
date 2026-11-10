import { ArrowRight, ChevronRight, Document, Finance, Time } from '@carbon/icons-react'
import Header from '../components/Header'
import NavBar from '../components/NavBar'
import '../css/home.css'
import { useRef } from 'react';
import { useUser } from '../hooks/useUser';

const Home = () => {

    const { user } = useUser()

    const textareaRef = useRef(null);

    const handleInput = () => {
        const element = textareaRef.current;
        if (!element) return;
        element.style.height = 'auto';
        element.style.height = `${element.scrollHeight}px`;
    };

    const firstName = user?.name?.trim().split(/\s+/)[0] || ""

    return (
        <main className='home-main'>
            <Header />
            <section className='home-content'>
                <div className='home-content-input'>
                    <h1>Olá, {firstName}.</h1>
                    <h2>O que precisa de resolver?</h2>
                    <article className='home-content-input-textarea'>
                        <textarea ref={textareaRef} onChange={handleInput} rows={1} placeholder='Escreva uma pergunta...' />
                        <button><ArrowRight size={15} /></button>
                    </article>
                    <article className='home-content-input-tools'>
                        <button><span><Finance size={22} /> Encontrar um órgão</span><ChevronRight size={18} /></button>
                        <button><span><Document size={22} /> Saber que documentos preciso</span><ChevronRight size={18} /></button>
                        <button><span><Time size={22} /> Acompanhar um pedido</span><ChevronRight size={18} /></button>
                    </article>
                </div>
            </section>
            <NavBar />
        </main>
    )
}

export default Home
