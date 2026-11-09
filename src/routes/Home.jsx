import { ArrowRight, ChevronRight, Document, Finance, Time } from '@carbon/icons-react'
import Header from '../components/Header'
import '../css/home.css'
import { useRef } from 'react';

const Home = () => {
    const textareaRef = useRef(null);

    const handleInput = () => {
        const element = textareaRef.current;
        if (!element) return;
        element.style.height = 'auto';
        element.style.height = `${element.scrollHeight}px`;
    };

    return (
        <main className='home-main'>
            <Header />
            <section className='home-content'>
                <div className='home-content-input'>
                    <h1>Olá, Usuário.</h1>
                    <h2>O que precisa de resolver?</h2>
                    <article className='home-content-input-textarea'>
                        <textarea ref={textareaRef} onChange={handleInput} rows={1} placeholder='Escreva uma pergunta...' />
                        <button><ArrowRight size={19} /></button>
                    </article>
                    <article className='home-content-input-tools'>
                        <button><span><Finance size={28} /> Encontrar um órgão</span><ChevronRight size={20} /></button>
                        <button><span><Document size={28} /> Saber que documentos preciso</span><ChevronRight size={20} /></button>
                        <button><span><Time size={28} /> Acompanhar um pedido</span><ChevronRight size={20} /></button>
                    </article>
                </div>
            </section>
        </main>
    )
}

export default Home
