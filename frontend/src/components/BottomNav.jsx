import { NavLink } from "react-router-dom";
import home from "../assets/images/house.png";
import matches from "../assets/images/match2.png";
import profile from "../assets/images/profile.png";
import settings from "../assets/images/settings.png";

export default function BottomNav() {
    return (
        <nav className="bottom-nav">

        <NavLink
            to="/app/discover"
            className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}
        >
            <img src={home} alt="Discover" />
            <span> <h5> Descubrir </h5> </span>
        </NavLink>

        <NavLink
            to="/app/matches"
            className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}
        >
            <img src={matches} alt="Matches" />
            <span> <h5> Chats </h5> </span>
        </NavLink>

        <NavLink
            to="/app/profile"
            className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}
        >
            <img src={profile} alt="Perfil" />
            <span><h5> Perfil </h5> </span>
        </NavLink>

        <NavLink
            to="/app/settings"
            className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}
        >
            <img src={settings} alt="Ajustes" />
            <span> <h5> Ajustes </h5> </span>
        </NavLink>

        </nav>
    );
}