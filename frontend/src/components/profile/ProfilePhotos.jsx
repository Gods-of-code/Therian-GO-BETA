import { useState } from "react";

export default function ProfilePhotos({ photos = [] }) {
    const [selectedPhoto, setSelectedPhoto] = useState(null);

    return (
        <div className="profile-section">
            <h3 className="profile-section-title">Fotos</h3>
            <div className="profile-photos-grid">

                {photos.map((photo, index) => (
                    <div key={index} className="profile-photo-item">
                        <img src={photo} alt={`foto ${index + 1}`} className="profile-photo-img" />
                    </div>
                ))}

                {/* Botón para subir foto */}
                <div className="profile-photo-add">
                    <span>+</span>
                </div>

            </div>
        </div>
    );
}