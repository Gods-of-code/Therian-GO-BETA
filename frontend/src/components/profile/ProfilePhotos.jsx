import { useState } from "react";

export default function ProfilePhotos({ photos = [], isOwner = false }) {
    const [photoToDelete, setPhotoToDelete] = useState(null);

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
                        <button className="modal-option modal-option--danger" onClick={() => {
                            // llamada al backend para eliminar la foto
                            setPhotoToDelete(null);
                        }}>
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