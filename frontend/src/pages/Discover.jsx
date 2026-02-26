import { useState } from "react";
import { useProfile } from "../pages/ProfileContext";
import "./Discover.css";

export default function Discover() {

    const { profile } = useProfile();
    const { name, age, bio, type, searching, interests, photos = [] } = profile;

    const [swipeDirection, setSwipeDirection] = useState(null);

    const handleReject = () => {
        setSwipeDirection("left");
        setTimeout(() => {
            setSwipeDirection(null);
        }, 400);
    };

    const handleLike = () => {
        setSwipeDirection("right");
        setTimeout(() => {
            setSwipeDirection(null);
        }, 400);
    };

    const currentImage = photos[10] || "https://picsum.photos/357";

    return (
        <div className="discover-container">

            <div className={`card ${swipeDirection}`}>

            {/* IMAGEN */}
            <div
                className="card-image"
                style={{ backgroundImage: `url(${currentImage})` }}
            >
                <div className="image-overlay" />

                <div className="card-header">
                <h2>{name}, {age}</h2>
                {profile.location && (
                    <p className="location">{profile.location}</p>
                )}
                </div>
            </div>

            {/* CONTENIDO SCROLL INTERNO */}
            <div className="card-body">

                {bio && <p className="card-bio">{bio}</p>}

                {searching?.length > 0 && (
                <div className="card-section">
                    <strong>Busca</strong>
                    <div className="tags">
                    {searching.map((item, i) => (
                        <span key={i}>{item}</span>
                    ))}
                    </div>
                </div>
                )}

                {interests?.length > 0 && (
                <div className="card-section">
                    <strong>Intereses</strong>
                    <div className="tags">
                    {interests.map((item, i) => (
                        <span key={i}>{item}</span>
                    ))}
                    </div>
                </div>
                )}

            </div>

            </div>

            {/* BOTONES FLOTANTES */}
            <div className="actions">
            <button className="reject" onClick={handleReject}>✕</button>
            <button className="super">★</button>
            <button className="like" onClick={handleLike}>❤</button>
            </div>

        </div>
        );
}