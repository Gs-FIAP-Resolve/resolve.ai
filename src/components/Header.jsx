import logo from '../assets/svg/resolve.svg'
import { useUser } from '../hooks/useUser';

const Header = () => {

    const { user } = useUser()

    const initials = user?.name?.trim().split(/\s+/).filter(Boolean).map((name, index, arr) => index === 0 || index === arr.length - 1 ? name[0] : "").join("").toUpperCase() || "";

    return (
        <header className='header-main'>
            <img className='header-logo' src={logo} alt="Resolve logo" />
            <div className='header-avatar'>
                {initials}
            </div>
        </header>
    )
}

export default Header
