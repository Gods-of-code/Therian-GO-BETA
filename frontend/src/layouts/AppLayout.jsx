import { Outlet } from "react-router-dom";
import BottomNav from "../components/BottomNav";
import "../styles/global.css";

export default function AppLayout() {
    return (
        <div className="app-wrapper">
        <div className="app-container">

            <header className="app-header">
            <h1>Therian GO</h1>
            </header>

            <main className="app-content">
            <Outlet />
            </main>

            <BottomNav />

        </div>
        </div>
    );
}