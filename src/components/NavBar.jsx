import { Finance, History, Home, Notification, User } from "@carbon/icons-react"
import { NavLink } from "react-router-dom"

const NavBar = () => {
    return (
        <nav className="navbar-main">
            <NavLink to='/home'>
                <Home className="icon" size={20} />
                <span>Início</span>
            </NavLink>
            <NavLink to='/'>
                <History className="icon" size={20} />
                <span>Histórico</span>
            </NavLink>
            <NavLink to='/'>
                <Finance className="icon active" size={20} />
                <span>Órgãos</span>
            </NavLink>
            <NavLink to='/'>
                <Notification className="icon" size={20} />
                <span>Novidades</span>
            </NavLink>
            <NavLink to='/'>
                <User className="icon" size={20} />
                <span>Perfil</span>
            </NavLink>
        </nav>
    )
}

export default NavBar
