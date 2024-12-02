const { NavLink } = ReactRouterDOM;

export function AppHeader() {
    return (
        <header className="app-header full main-layout">
            <section>
                <h1>React Book App</h1>
                
                <nav className="app-nav">
                    <NavLink to="/home">Home</NavLink>
                    <NavLink to="/about">About</NavLink>
                    <NavLink to="/book" >Book</NavLink>
                    <NavLink to="/dashboard" >Dashboard</NavLink>
                </nav>
            </section>
        </header>
    )
}
