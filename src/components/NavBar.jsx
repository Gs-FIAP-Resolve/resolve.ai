import { Bookmark, History, Home, User } from "@carbon/icons-react"
import { NavLink } from "react-router-dom"

const NavBar = () => {
    return (
        <nav className="navbar-main">
            <NavLink to='/home'>
                <Home size={20} />
                Inicío
            </NavLink>
            <NavLink to='/'>
                <History size={20} />
                Atividade
            </NavLink>
            <NavLink to='/'>
                <Bookmark size={20} />
                Guardados
            </NavLink>
            <NavLink to='/'>
                <User size={20} />
                Perfil
            </NavLink>
        </nav>
    )
}

export default NavBar
