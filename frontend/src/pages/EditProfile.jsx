import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import flecha from "../assets/images/flecha.png";
import { useProfile } from "../pages/ProfileContext";

const TYPE_OPTIONS = ["Wolf", "Fox", "Cat", "Bear", "Deer", "Other"];

export default function EditProfile() {
    const { profile, setProfile } = useProfile();
    const navigate = useNavigate();

    const [type, setType] = useState(profile.type);
    const [city, setCity] = useState(profile.city);
    const [bio, setBio] = useState(profile.bio);
    const [interests, setInterests] = useState(profile.interests);
    const [newInterest, setNewInterest] = useState("");
    const [lookingFor, setLookingFor] = useState({
        Amistad: profile.searching.includes("Amistad"),
        Pareja: profile.searching.includes("Pareja"),
        Comunidad: profile.searching.includes("Comunidad"),
        Otros: profile.searching.includes("Otros"),
    });

    const handleSave = () => {
        const newSearching = Object.entries(lookingFor)
            .filter(([_, value]) => value)
            .map(([key]) => key);

        setProfile({
            ...profile,
            type,
            city,
            bio,
            interests,
            searching: newSearching,
        });

        navigate("/app/profile");
    };

    const handleToggle = (key) => {
        setLookingFor({
            ...lookingFor,
            [key]: !lookingFor[key],
        });
    };

    const handleAddInterest = () => {
        if (!newInterest.trim()) return;
        if (interests.includes(newInterest.trim())) return;
        setInterests([...interests, newInterest.trim()]);
        setNewInterest("");
    };

    const handleRemoveInterest = (index) => {
        setInterests(interests.filter((_, i) => i !== index));
    };

    return (
        <div className="edit-profile">

            {/* Header */}
            <div className="edit-header">
                <button onClick={() => navigate("/app/profile")} className="edit-exit-btn">
                    <img src={flecha} alt="Salir" />
                    <span>Salir</span>
                </button>
            </div>

            {/* Type */}
            <div className="edit-section">
                <h3 className="edit-section-title">Type</h3>
                <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="edit-select"
                >
                    {TYPE_OPTIONS.map((option) => (
                        <option key={option} value={option.toLowerCase()}>
                            {option}
                        </option>
                    ))}
                </select>
            </div>

            {/* Ciudad */}
            <div className="edit-section">
                <h3 className="edit-section-title">Ciudad</h3>
                <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="edit-input"
                />
            </div>

            {/* Sobre mí */}
            <div className="edit-section">
                <h3 className="edit-section-title">Sobre mí</h3>
                <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    rows={4}
                    placeholder="Cuéntale a los demás algo sobre ti!"
                    className="edit-textarea"
                />
            </div>

            {/* Intereses */}
            <div className="edit-section">
                <h3 className="edit-section-title">Intereses</h3>

                <div className="edit-interests">
                    {interests.map((interest, index) => (
                        <span key={index} className="edit-interest">
                            {interest}
                            <button
                                onClick={() => handleRemoveInterest(index)}
                                className="edit-interest-remove"
                            >
                                ×
                            </button>
                        </span>
                    ))}
                </div>

                <div className="edit-interest-add">
                    <input
                        type="text"
                        value={newInterest}
                        onChange={(e) => setNewInterest(e.target.value)}
                        placeholder="Añadir interés"
                        onKeyDown={(e) => e.key === "Enter" && handleAddInterest()}
                        className="edit-input"
                    />
                    <button onClick={handleAddInterest} className="edit-interest-btn">
                        +
                    </button>
                </div>
            </div>

            {/* Buscando */}
            <div className="edit-section">
                <h3 className="edit-section-title">Buscando</h3>

                <div className="looking-options">
                    {Object.entries(lookingFor).map(([key, value]) => (
                        <div key={key} className="looking-row">
                            <span className="looking-label capitalize">{key}</span>
                            <label className="toggle-switch">
                                <input
                                    type="checkbox"
                                    checked={value}
                                    onChange={() => handleToggle(key)}
                                />
                                <span className="toggle-slider"></span>
                            </label>
                        </div>
                    ))}
                </div>
            </div>

            {/* Guardar */}
            <div className="edit-save-btn">
                <Button onClick={handleSave}>Guardar cambios</Button>
            </div>

        </div>
    );
}