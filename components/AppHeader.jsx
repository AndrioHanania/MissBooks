import { userService } from '../services/user.service.js';
import { LoginSignup } from './LoginSignup.jsx';
import { showErrorMsg } from '../services/event-bus.service.js';

const { useState } = React;
const { Link, NavLink } = ReactRouterDOM;
const { useNavigate } = ReactRouter;

export function AppHeader() {
    const navigate = useNavigate();
    const [user, setUser] = useState(userService.getLoggedinUser());
    
    function onLogout() {
        userService.logout()
            .then(() => {
                onSetUser(null)
            })
            .catch((err) => {
                showErrorMsg('OOPs try again')
            })
    }

    function onSetUser(user) {
        setUser(user)
        navigate('/')
    }

    return (
        <header className="app-header full main-layout">
            <section className="header-container">
                <h1>React Book App</h1>

                <nav className="app-nav">
                    <NavLink to="/home">Home</NavLink>
                    <NavLink to="/about">About</NavLink>
                    <NavLink to="/book" >Book</NavLink>
                    <NavLink to="/dashboard" >Dashboard</NavLink>
                </nav>

                {user ? (
                    < section >

                        <Link to={`/user/${user._id}`}>Hello {user.fullname}</Link>
                        <button onClick={onLogout}>Logout</button>
                    </ section >
                ) : (
                    <section>
                        <LoginSignup onSetUser={onSetUser} />
                    </section>
                )}
            </section>
        </header>
    )
}
