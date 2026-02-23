import { useState, useRef } from "react";
import "./Profile.css";
import "./EditProfile.css";
import ProfileAvatar from "../components/profile/ProfileAvatar";
import location from "../assets/images/location.png";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import { useProfile } from "../pages/ProfileContext";

export default function Profile() {

    const { profile, setProfile } = useProfile();
    const { name, type, age, city, bio, interests, photoUrl, photos = [] } = profile;

    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    const fileInputRef = useRef(null);

    const handleAddPhoto = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();

        reader.onloadend = () => {
            setProfile(prev => ({
                ...prev,
                photos: [...(prev.photos || []), reader.result]
            }));
        };

        reader.readAsDataURL(file);
        event.target.value = null;
    };

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

            {bio && (
                <div className="profile-section">
                    <h3>Sobre mí</h3>
                    <p>{bio}</p>
                </div>
            )}

            {interests?.length > 0 && (
                <div className="profile-section">
                    <h3>Intereses</h3>
                    <div className="profile-interests">
                        {interests.map((interest, index) => (
                            <span key={index} className="profile-type">
                                {interest}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {/* FOTOS */}
            <div className="profile-section">
                <h3>Fotos</h3>

                <div className="photos-grid">

                    {photos.map((photo, index) => (
                        <div key={index} className="photo-item">
                            <img src={photo} alt="profile" />

                            {isEditing && (
                                <button
                                    className="delete-photo"
                                    onClick={() => {
                                        setProfile(prev => ({
                                            ...prev,
                                            photos: prev.photos.filter((_, i) => i !== index)
                                        }));
                                    }}
                                >
                                    ×
                                </button>
                            )}
                        </div>
                    ))}

                    {isEditing && (
                        <div
                            className="add-photo"
                            onClick={() => fileInputRef.current.click()}
                        >
                            +
                        </div>
                    )}

                </div>
            </div>

            <div className="profile-edit-btn">
                {!isEditing ? (
                    <Button onClick={() => setShowModal(true)}>
                        Editar perfil
                    </Button>
                ) : (
                    <Button onClick={() => setIsEditing(false)}>
                        Guardar cambios
                    </Button>
                )}
            </div>

            <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                style={{ display: "none" }}
                onChange={handleAddPhoto}
            />

            {showModal && (
                <div
                    className="modal-overlay"
                    onClick={() => setShowModal(false)}
                >
                    <div
                        className="modal"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h3>¿Qué quieres realizar?</h3>

                        <button
                            className="modal-option"
                            onClick={() => {
                                setShowModal(false);
                                setIsEditing(true);
                            }}
                        >
                            Añadir o borrar fotos
                        </button>

                        <button
                            className="modal-option"
                            onClick={() => {
                                setShowModal(false);
                                navigate("/app/edit-profile");
                            }}
                        >
                            Editar información de tu perfil
                        </button>
                    </div>
                </div>
            )}

        </div>
    );
}