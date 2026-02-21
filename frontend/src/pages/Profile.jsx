import { useState } from "react";
import "../styles/global.css";
import ProfileAvatar from "../components/profile/ProfileAvatar";
import location from "../assets/images/location.png";
import ProfilePhotos from "../components/profile/ProfilePhotos";

export default function Profile() {

    const photoUrl = null;
    const name = "thomas"; // Thomas
    const type = "wolf"; // Wolf
    const age = 19; // 19
    const city = "Pereira"; // Pereira
    const searching = "Relacion"; // Relacion
    const bio = "Cuentale a los demás algo sobre ti!"; // Bio
    const interests = ["Música", "Viajes", "Deportes"]; // Intereses
    //const photos = [];
    const photos = [
    "https://picsum.photos/200",
    "https://picsum.photos/201",
    "https://picsum.photos/202",
];
    
    return (
        <div>
            <ProfileAvatar src={photoUrl} />
            {name && <h2 className="profile-name">{name}</h2>}
            <div className="profile-labels">
                {type && <span className="profile-type">{type}</span>}
                {age && <span className="profile-age">{age} años</span>}
            </div>

            {city && (
                <div className="profile-city">
                    <img src={location
                    } alt = "ubicacion" className="profile-city-icon"/>
                    <span>{city}</span>
                </div>
            )}

            {searching && (
                <div className="profile-searching">
                <span className="profile-searching-label">Buscando:</span>
                <span className="profile-searching-value">{searching}</span>
                </div>
            )}

            {bio && (
                <div className="profile-section">
                <h3 className="profile-section-title">Sobre mí</h3>
                <p className="profile-bio">{bio}</p>
                </div>
            )}

            {interests.length > 0 && (
                <div className="profile-section">
                <h3 className="profile-section-title">Intereses</h3>
                <div className="profile-interests">
                {interests.map((interest, index) => (
                    <span key={index} className="profile-type">{interest}</span>
            ))}
        </div>

        <ProfilePhotos photos={photos} />

    </div>
)}
        </div>
    );
}
