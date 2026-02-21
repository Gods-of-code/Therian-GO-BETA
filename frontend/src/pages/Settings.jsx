import { useState, useEffect } from "react";

export default function Settings() {

    const [darkMode, setDarkMode] = useState(
        localStorage.getItem("darkMode") === "true"
    );

    const [ageRange, setAgeRange] = useState(35);
    const [distance, setDistance] = useState(50);

    // Aplicar modo oscuro global y persistente
    useEffect(() => {
        if (darkMode) {
        document.body.classList.add("dark");
        localStorage.setItem("darkMode", "true");
        } else {
        document.body.classList.remove("dark");
        localStorage.setItem("darkMode", "false");
        }
    }, [darkMode]);

    return (
        <div className="settings-page">

        <div className="settings-header">
            <img src="/icons/back.svg" alt="" className="header-icon" />
            <h2>Configuración</h2>
        </div>

        {/* APARIENCIA */}
        <section className="settings-section">
            <div className="section-title">
            <img src="/icons/appearance.svg" alt="" />
            <span>Apariencia</span>
            </div>

            <div className="settings-row">
            <span>Modo Oscuro</span>
            <label className="toggle">
                <input
                type="checkbox"
                checked={darkMode}
                onChange={() => setDarkMode(!darkMode)}
                />
                <span className="toggle-slider"></span>
            </label>
            </div>
        </section>

        {/* PREFERENCIAS */}
        <section className="settings-section">
            <div className="section-title">
            <img src="/icons/preferences.svg" alt="" />
            <span>Preferencias de Búsqueda</span>
            </div>

            <div className="settings-column">
            <label>Tipo de Therian</label>
            <select className="settings-select">
                <option>Todos los tipos</option>
            </select>
            </div>

            <div className="settings-column">
            <div className="range-header">
                <label>Rango de Edad</label>
                <span>18 - {ageRange}</span>
            </div>
            <input
                className="range-input"
                type="range"
                min="18"
                max="60"
                value={ageRange}
                onChange={(e) => setAgeRange(e.target.value)}
            />
            </div>

            <div className="settings-column">
            <div className="range-header">
                <label>Distancia Máxima</label>
                <span>{distance} km</span>
            </div>
            <input
                className="range-input"
                type="range"
                min="1"
                max="100"
                value={distance}
                onChange={(e) => setDistance(e.target.value)}
            />
            </div>

            <div className="settings-row">
            <span>Mostrar mi distancia</span>
            <label className="toggle">
                <input type="checkbox" defaultChecked />
                <span className="toggle-slider"></span>
            </label>
            </div>
        </section>

        {/* BUSCANDO */}
        <section className="settings-section">
            <div className="section-title">
            <img src="/icons/search.svg" alt="" />
            <span>Buscando</span>
            </div>

            {["Relación", "Amistad", "Comunidad"].map(item => (
            <div className="settings-row" key={item}>
                <span>{item}</span>
                <label className="toggle">
                <input type="checkbox" defaultChecked />
                <span className="toggle-slider"></span>
                </label>
            </div>
            ))}
        </section>

        {/* NOTIFICACIONES */}
        <section className="settings-section">
            <div className="section-title">
            <img src="/icons/notifications.svg" alt="" />
            <span>Notificaciones</span>
            </div>

            {["Nuevos Matches", "Mensajes", "Me Gusta Recibidos"].map(item => (
            <div className="settings-row" key={item}>
                <span>{item}</span>
                <label className="toggle">
                <input type="checkbox" defaultChecked />
                <span className="toggle-slider"></span>
                </label>
            </div>
            ))}
        </section>

        {/* PRIVACIDAD */}
        <section className="settings-section">
            <div className="section-title">
            <img src="/icons/security.svg" alt="" />
            <span>Privacidad y Seguridad</span>
            </div>

            <button className="settings-btn">Usuarios Bloqueados</button>
            <button className="settings-btn">Verificar mi Perfil</button>
            <button className="settings-btn danger">
            Reportar un Problema
            </button>

            <p className="security-text">
            Tu seguridad es nuestra prioridad. Todos los perfiles son moderados y verificados.
            </p>
        </section>

        <button className="logout-btn">Cerrar Sesión</button>
        <button className="secondary-btn">Normas de la Comunidad</button>
        <button className="secondary-btn">Ayuda y Soporte</button>

        </div>
    );
}