import { NavLink } from "react-router-dom";

export default function BottomNav() {
    return (
        <nav className="bottom-nav">
        <NavLink to="/app/discover">Discover</NavLink>
        <NavLink to="/app/matches">Matches</NavLink>
        <NavLink to="/app/profile">Profile</NavLink>
        <NavLink to="/app/settings">Settings</NavLink>
        </nav>
    );
}
