import { Bookmark, History, Home, Notification, User } from "@carbon/icons-react"
import { NavLink } from "react-router-dom"

const NavBar = () => {
    return (
        <nav className="navbar-main">
            <NavLink to='/home'>
                <Home className="icon" size={20} />
            </NavLink>
            <NavLink to='/'>
                <History className="icon" size={20} />
            </NavLink>
            <NavLink to='/'>
                <Bookmark className="icon" size={20} />
            </NavLink>
            <NavLink to='/'>
                <Notification className="icon" size={20} />
            </NavLink>
            <NavLink to='/'>
                <User className="icon" size={20} />
            </NavLink>
        </nav>
    )
}

export default NavBar
