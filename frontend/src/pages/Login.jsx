import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Auth.css";
import loginImg from "../assets/images/login.png";
import Button from "../components/Button";

const API_URL = "http://localhost:8000";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const formData = new URLSearchParams();
            formData.append("username", email);
            formData.append("password", password);

            const response = await fetch(`${API_URL}/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                body: formData,
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.detail || "Error al iniciar sesión");
            }

            const data = await response.json();

            // Guardar token en localStorage
            localStorage.setItem("token", data.access_token);
            localStorage.setItem("token_type", data.token_type);

            navigate("/app/discover");

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <img src={loginImg} className="logo" alt="Therian Go" />
                <h1>Therian Go</h1>
                <p className="subtitle">Conecta con tu comunidad</p>

                {error && (
                    <div className="error-message" style={{ color: "red", marginBottom: "10px" }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <label>Email</label>
                    <input
                        type="email"
                        placeholder="tu@email.com"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <label>Contraseña</label>
                    <input
                        type="password"
                        placeholder="********"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <Button disabled={loading}>
                        {loading ? "Cargando..." : "Iniciar sesión"}
                    </Button>
                </form>

                <div className="divider">
                    <span>O continúa con</span>
                </div>

                <div className="social-buttons">
                    <button className="btn-social">Google</button>
                    <button className="btn-social">Apple</button>
                </div>

                <p className="switch">
                    ¿No tienes cuenta? <Link to="/register">Regístrate</Link>
                </p>
            </div>
        </div>
    );
}