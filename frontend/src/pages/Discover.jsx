import { useState, useEffect } from "react";
import { useProfile } from "../pages/ProfileContext";
import "./Discover.css";

export default function Discover() {

    useEffect(() => {
        const originalOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
        document.body.style.overflow = originalOverflow;
        };
    }, []);

    const { profile } = useProfile();
    const {
        name,
        age,
        bio,
        type,
        searching,
        interests,
        photos = [],
        location
    } = profile;

    const [swipeDirection, setSwipeDirection] = useState(null);
    const [isAnimating, setIsAnimating] = useState(false);

    const handleReject = () => {
        if (isAnimating) return;
        setIsAnimating(true);
        setSwipeDirection("left");
    };

    const handleLike = () => {
        if (isAnimating) return;
        setIsAnimating(true);
        setSwipeDirection("right");
    };

    const currentImage = photos[0] || "https://picsum.photos/500/800";

    return (
        <div className="discover-container">
        <div
            className={`card ${swipeDirection || ""}`}
            onTransitionEnd={() => {
            if (swipeDirection) {
                setTimeout(() => {
                setSwipeDirection(null);
                setIsAnimating(false);
                }, 100);
            }
            }}
        >
            <div
            className="card-image"
            style={{ backgroundImage: `url(${currentImage})` }}
            >
            <div className="image-overlay"></div>
            <div className="card-header">
                <h2>{name}, {age}</h2>
                {type && <span className="animal-type">{type}</span>}
                {location && <p className="location">📍 {location}</p>}
            </div>
            </div>

            <div className="card-body">
            {bio && (
                <div className="card-section">
                <strong>Sobre mí</strong>
                <p>{bio}</p>
                </div>
            )}

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

            <div className="actions">
            <button className="reject" onClick={handleReject}>
                ✕
            </button>
            <button className="like" onClick={handleLike}>
                ❤
            </button>
            </div>
        </div>
        </div>
    );
}