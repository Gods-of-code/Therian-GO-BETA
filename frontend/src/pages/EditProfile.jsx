import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./EditProfile.css";
import "./Settings.css";
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
        amistad: profile.searching.includes("amistad"),
        pareja: profile.searching.includes("pareja"),
        comunidad: profile.searching.includes("comunidad"),
        otros: profile.searching.includes("otros"),
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
            [key]: !lookingFor[key]
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

            <div className="edit-header">
                <button
                    className="edit-exit-btn"
                    onClick={() => navigate("/app/profile")}
                >
                    <img src={flecha} alt="Salir" />
                    <span>Salir</span>
                </button>
            </div>

            <div className="edit-section">
                <h3 className="edit-section-title">Type</h3>
                <select
                    className="edit-select"
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                >
                    {TYPE_OPTIONS.map((option) => (
                        <option key={option} value={option.toLowerCase()}>
                            {option}
                        </option>
                    ))}
                </select>
            </div>

            <div className="edit-section">
                <h3 className="edit-section-title">Ciudad</h3>
                <input
                    className="edit-input"
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                />
            </div>

            <div className="edit-section">
                <h3 className="edit-section-title">Sobre mí</h3>
                <textarea
                    className="edit-textarea"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    rows={4}
                />
            </div>

            <div className="edit-section">
                <h3 className="edit-section-title">Intereses</h3>

                <div className="edit-interests">
                    {interests.map((interest, index) => (
                        <span key={index} className="edit-interest">
                            {interest}
                            <button
                                className="edit-interest-remove"
                                onClick={() => handleRemoveInterest(index)}
                            >
                                ×
                            </button>
                        </span>
                    ))}
                </div>

                <div className="edit-interest-add">
                    <input
                        className="edit-input"
                        type="text"
                        value={newInterest}
                        onChange={(e) => setNewInterest(e.target.value)}
                        placeholder="Añadir interés"
                        onKeyDown={(e) => e.key === "Enter" && handleAddInterest()}
                    />
                    <button className="edit-interest-btn" onClick={handleAddInterest}>
                        +
                    </button>
                </div>
            </div>

            <div className="edit-section">
                <h3 className="edit-section-title">Buscando</h3>

                <div className="looking-options">
                    {Object.entries(lookingFor).map(([key, value]) => (
                        <div className="looking-row" key={key}>
                            <span className="looking-label">
                                {key.charAt(0).toUpperCase() + key.slice(1)}
                            </span>
                            <label className="toggle">
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

            <div className="edit-save-btn">
                <Button onClick={handleSave}>
                    Guardar cambios
                </Button>
            </div>

        </div>
    );
}