import { useState } from "react";
import "../styles/global.css";
import welcome from "../assets/images/welcome.png";
import heart from "../assets/images/heart.png";
import match from "../assets/images/match.png";
import chat from "../assets/images/chat.png";

export default function Onboarding() {

    const [current, setCurrent] = useState(0);

    const slides = [
        {
        image: welcome,
        title: "Bienvenido a Therian Now",
        text: "Un espacio seguro para conectar con otros miembros de la comunidad therian"
        },
        {
        image: heart,
        title: "Descubre Conexiones",
        text: "Desliza para descubrir perfiles que resuenen con tu espíritu"
        },
        {
        image: match,
        title: "Haz Match",
        text: "Cuando ambos se gustan, se crea una conexión auténtica"
        },
        {
        image: chat,
        title: "Comienza a Chatear",
        text: "Conoce a tu match y crea vínculos significativos"
        }
    ];

    const nextSlide = () => {
        if (current < slides.length - 1) {
        setCurrent(current + 1);
        } else {
            window.location.href = "/login";
        }
    };

    return (
        <main className="onboarding">

        <div className="slider">

            <div className="progress">
            {slides.map((_, index) => (
                <span
                key={index}
                className={`dot ${index === current ? "active" : ""}`}
                />
            ))}
            </div>

            <div className="slide active">
            <div className="content">
                <img src={slides[current].image} alt="slide" />
                <h1>{slides[current].title}</h1>
                <p>{slides[current].text}</p>
            </div>

            <div className="actions">
                <button className="btn-primary" onClick={nextSlide}>
                {current === slides.length - 1 ? "Comenzar →" : "Siguiente →"}
                </button>
            </div>
            </div>

        </div>

        </main>
    );
}
