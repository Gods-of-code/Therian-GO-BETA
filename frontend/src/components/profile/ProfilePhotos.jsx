import { useState } from "react";
import { useProfile } from "../../pages/ProfileContext";

export default function ProfilePhotos({ isOwner = false }) {
    const { profile, setProfile } = useProfile();
    const { photos } = profile;
    const [photoToDelete, setPhotoToDelete] = useState(null);

    const handleDelete = () => {
        setProfile({
            ...profile,
            photos: photos.filter((p) => p !== photoToDelete)
        });
        setPhotoToDelete(null);
    };

    return (
        <div className="profile-section">
            <h3 className="profile-section-title">Fotos</h3>
            <div className="profile-photos-grid">
                {photos.map((photo, index) => (
                    <div
                        key={index}
                        className="profile-photo-item"
                        onClick={() => isOwner && setPhotoToDelete(photo)}
                    >
                        <img src={photo} alt={`foto ${index + 1}`} className="profile-photo-img" />
                    </div>
                ))}
                {isOwner && (
                    <div className="profile-photo-add">
                        <span>+</span>
                    </div>
                )}
            </div>

            {photoToDelete && (
                <div className="modal-overlay" onClick={() => setPhotoToDelete(null)}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <h3 className="modal-title">¿Deseas eliminar esta foto?</h3>
                        <img src={photoToDelete} alt="foto a eliminar" className="modal-preview" />
                        <button className="modal-option modal-option--danger" onClick={handleDelete}>
                            Eliminar
                        </button>
                        <button className="modal-option" onClick={() => setPhotoToDelete(null)}>
                            Cancelar
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}