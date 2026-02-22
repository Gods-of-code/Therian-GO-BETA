import { useState } from "react";
import "./Auth.css";
import Button from "../components/Button";
import { Link, useNavigate } from "react-router-dom";

const API_URL = "http://localhost:8000";

export default function Register() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState("");
    const [therianType, setTherianType] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const response = await fetch(`${API_URL}/auth/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username: username,
                    email: email,
                    password: password
                }),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.detail || "Error al crear la cuenta");
            }

            alert("Cuenta creada correctamente");
            navigate("/login");
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">

                <h1>Therian Go</h1>
                <p className="subtitle">Crea tu cuenta</p>

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

                    <label>Nombre de Usuario</label>
                    <input
                        type="text"
                        placeholder="Tu nombre (sin espacios)"
                        required
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />

                    <label>Tipo Therian</label>
                    <input
                        type="text"
                        placeholder="Ej: Wolf, Fox, Cat..."
                        required
                        value={therianType}
                        onChange={(e) => setTherianType(e.target.value)}
                    />

                    <Button disabled={loading}>
                        {loading ? "Cargando..." : "Crear Cuenta"}
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
                    ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
                </p>

            </div>
        </div>
    );
}
