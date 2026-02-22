import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import flecha from "../assets/images/flecha.png";

const TYPE_OPTIONS = ["Wolf", "Fox", "Cat", "Bear", "Deer", "Other"];

export default function EditProfile() {
    const navigate = useNavigate();

    const [type, setType] = useState("wolf");
    const [city, setCity] = useState("Pereira");
    const [bio, setBio] = useState("Cuéntale a los demás algo sobre ti!");
    const [interests, setInterests] = useState(["Música", "Viajes", "Deportes"]);
    const [newInterest, setNewInterest] = useState("");

    const [lookingFor, setLookingFor] = useState({
        amistad: true,
        pareja: false,
        comunidad: true,
        otros: false
    });

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

    const handleSave = () => {
        console.log({ type, city, bio, interests, lookingFor });
        navigate("/app/profile");
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