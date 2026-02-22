import { useState } from "react";
import { Link } from "react-router-dom";
import loginImg from "../assets/images/login.png";
import Button from "../components/Button";

export default function Login() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (e) => {
    e.preventDefault();

    try {
        const formData = new URLSearchParams();
        formData.append("username", email);
        formData.append("password", password);

        const response = await fetch("http://localhost:8000/api/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: formData,
        });

        if (!response.ok) {
            throw new Error("Credenciales incorrectas");
        }

        const data = await response.json();

        // 🔥 Guardamos token
        localStorage.setItem("token", data.access_token);

        window.location.href = "/app/discover";

    } catch (error) {
        alert(error.message);
    }
};
    return (
        <div className="auth-container">
            <div className="auth-card">

                <img src={loginImg} className="logo" />

                <h1>Therian Go</h1>
                <p className="subtitle">Conecta con tu comunidad</p>

                <form onSubmit={handleSubmit}>
                    <label>Email</label>
                    <input 
                        type="email" 
                        placeholder="tu@email.com" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required 
                    />

                    <label>Contraseña</label>
                    <input 
                        type="password" 
                        placeholder="********"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required 
                    />

                    <Button> Iniciar sesión </Button>
                </form>

            </div>
        </div>
    );
}