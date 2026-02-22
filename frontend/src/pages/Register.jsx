import "../styles/global.css";
import Button from "../components/Button";
import { Link } from "react-router-dom";

export default function Register() {

    const handleSubmit = (e) => {
        e.preventDefault();
        alert("Cuenta creada correctamente");
        window.location.href = "/login";
    };

    return (
        <div className="auth-container">
            <div className="auth-card">

                <h1>Therian Go</h1>
                <p className="subtitle">Crea tu cuenta</p>

                <form onSubmit={handleSubmit}>

                <label>Email</label>
                <input type="email" placeholder="tu@email.com" required />

                <label>Contraseña</label>
                <input type="password" placeholder="********" required />

                <label>Nombre</label>
                <input type="text" placeholder="Tu nombre" required />

                <label>Tipo Therian</label>
                <input type="text" placeholder="Ej: Wolf, Fox, Cat..." required />

                <Button> Crear Cuenta </Button>

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
