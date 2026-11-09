import logo from '../assets/svg/resolve.svg'

const Header = () => {
    return (
        <header className='header-main'>
            <img className='header-logo' src={logo} alt="Resolve logo" />
            <div className='header-avatar'>
                UA
            </div>
        </header>
    )
}

export default Header
