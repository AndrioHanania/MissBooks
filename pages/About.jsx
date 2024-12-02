import { utilService } from "../services/util.service.js";

const {useRef} = React;
const { Outlet, NavLink } = ReactRouterDOM

export function About() {
    const titleRef = useRef();

    return (
        <section className="about">
            <h1 ref={titleRef}>About Books and us...</h1>
            <button onClick={()=>{
                utilService.animateCSS(titleRef.current);
            }}>Animate</button>

            <section>
                <nav>
                    <NavLink to="/about/team">Team</NavLink>
                    <NavLink to="/about/vision">Vision</NavLink>
                </nav>
            </section>

            <section>
                <Outlet />
            </section>
        </section>
    );
};