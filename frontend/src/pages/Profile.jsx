import { useState } from "react";
import "./Profile.css";
import "./EditProfile.css";
import ProfileAvatar from "../components/profile/ProfileAvatar";
import location from "../assets/images/location.png";
import ProfilePhotos from "../components/profile/ProfilePhotos";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import { useProfile } from "../pages/ProfileContext";

export default function Profile() {

    const { profile } = useProfile();
    const { name, type, age, city, searching, bio, interests, photoUrl, photos } = profile;

    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false);
    const [showAddPhoto, setShowAddPhoto] = useState(false);

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
                    <img src={location} alt="ubicacion" className="profile-city-icon" />
                    <span>{city}</span>
                </div>
            )}

            {searching.length > 0 && (
                <div className="profile-searching">
                    <span className="profile-searching-label">Buscando:</span>
                    <div className="profile-searching-values">
                        {searching.map((item, index) => (
                            <span key={index} className="profile-searching-value">{item}</span>
                        ))}
                    </div>
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
                </div>
            )}

            <ProfilePhotos isOwner={showAddPhoto} />

            <div className="profile-edit-btn">
                <Button onClick={() => setShowModal(true)}>
                    Editar perfil
                </Button>
            </div>

            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <h3 className="modal-title">¿Qué quieres realizar?</h3>
                        <button className="modal-option" onClick={() => {
                            setShowModal(false);
                            setShowAddPhoto(true);
                        }}>
                            Añadir o borrar fotos
                        </button>
                        <button className="modal-option" onClick={() => {
                            setShowModal(false);
                            navigate("/app/edit-profile");
                        }}>
                            Editar información de tu perfil
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}