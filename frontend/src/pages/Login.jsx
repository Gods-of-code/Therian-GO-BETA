import { Link } from "react-router-dom";
import loginImg from "../assets/images/login.png";
import Button from "../components/Button";


export default function Login() {

    const handleSubmit = (e) => {
        e.preventDefault();
        alert("Inicio de sesión simulado");
        window.location.href = "/app/discover"
    };

    return (
        <div className="auth-container">
            <div className="auth-card">

                <img src={loginImg} className="logo" />

                <h1>Therian Go</h1>
                <p className="subtitle">Conecta con tu comunidad</p>

                <form onSubmit={handleSubmit}>
                    <label>Email</label>
                    <input type="email" placeholder="tu@email.com" required />

                    <label>Contraseña</label>
                    <input type="password" placeholder="********" required />

                    <Button> Iniciar sesión </Button>
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