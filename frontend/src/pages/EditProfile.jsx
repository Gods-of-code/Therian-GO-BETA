import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";

const TYPE_OPTIONS = ["Wolf", "Fox", "Cat", "Bear", "Deer", "Other"];

export default function EditProfile() {
    const navigate = useNavigate();

    // Estados con valores actuales del usuario (vendrán del backend)
    const [type, setType] = useState("wolf");
    const [city, setCity] = useState("Pereira");
    const [bio, setBio] = useState("Cuentale a los demás algo sobre ti!");
    const [interests, setInterests] = useState(["Música", "Viajes", "Deportes"]);
    const [newInterest, setNewInterest] = useState("");

    const handleAddInterest = () => {
        if (newInterest.trim() === "") return;
        if (interests.includes(newInterest.trim())) return;
        setInterests([...interests, newInterest.trim()]);
        setNewInterest("");
    };

    const handleRemoveInterest = (index) => {
        setInterests(interests.filter((_, i) => i !== index));
    };

    const handleSave = () => {
        // aquí irá la llamada al backend para guardar los cambios
        console.log({ type, city, bio, interests });
        navigate("/app/profile");
    };    

    return (
        <div className="edit-profile">

            {/* Type */}
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

            {/* Ciudad */}
            <div className="edit-section">
                <h3 className="edit-section-title">Ciudad</h3>
                <input
                    className="edit-input"
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Tu ciudad"
                />
            </div>

            {/* Sobre mí */}
            <div className="edit-section">
                <h3 className="edit-section-title">Sobre mí</h3>
                <textarea
                    className="edit-textarea"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Cuéntale a los demás algo sobre ti"
                    rows={4}
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
                    <button className="edit-interest-btn" onClick={handleAddInterest}>+</button>
                </div>
            </div>

            {/* Botón guardar */}
            <div className="edit-save-btn">
                <Button onClick={handleSave}>
                    Guardar cambios
                </Button>
            </div>

        </div>
    );
}