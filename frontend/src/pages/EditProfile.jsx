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
        <div className="p-4">

        {/* Header */}
        <div className="flex items-center mb-5">
            <button
            onClick={() => navigate("/app/profile")}
            className="flex items-center gap-1.5 bg-transparent border-none text-sm font-semibold text-[#6f2d91] p-0 cursor-pointer"
            >
            <img src={flecha} alt="Salir" className="w-[18px] h-[18px]" />
            <span>Salir</span>
            </button>
        </div>

        {/* Type */}
        <div className="mt-6">
            <h3 className="text-base font-bold mb-2 text-gray-800">Type</h3>
            <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full px-3 py-2 text-sm text-gray-800 bg-white border-2 border-[#6f2d91] rounded-xl outline-none"
            >
            {TYPE_OPTIONS.map((option) => (
                <option key={option} value={option.toLowerCase()}>
                {option}
                </option>
            ))}
            </select>
        </div>

        {/* Ciudad */}
        <div className="mt-6">
            <h3 className="text-base font-bold mb-2 text-gray-800">Ciudad</h3>
            <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="w-full px-3 py-2 text-sm text-gray-800 border-2 border-[#6f2d91] rounded-xl outline-none"
            />
        </div>

        {/* Sobre mí */}
        <div className="mt-6">
            <h3 className="text-base font-bold mb-2 text-gray-800">Sobre mí</h3>
            <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={4}
            className="w-full px-3 py-2 text-sm text-gray-800 border-2 border-[#6f2d91] rounded-xl resize-none outline-none"
            />
        </div>

        {/* Intereses */}
        <div className="mt-6">
            <h3 className="text-base font-bold mb-2 text-gray-800">Intereses</h3>

            <div className="flex flex-wrap gap-2 mb-3">
            {interests.map((interest, index) => (
                <span
                key={index}
                className="inline-flex items-center gap-1.5 px-3 py-1 text-[13px] font-medium text-white bg-[#6f2d91] rounded-full"
                >
                {interest}
                <button
                    onClick={() => handleRemoveInterest(index)}
                    className="text-white text-base leading-none"
                >
                    ×
                </button>
                </span>
            ))}
            </div>

            <div className="flex items-center gap-2">
            <input
                type="text"
                value={newInterest}
                onChange={(e) => setNewInterest(e.target.value)}
                placeholder="Añadir interés"
                onKeyDown={(e) => e.key === "Enter" && handleAddInterest()}
                className="w-full px-3 py-2 text-sm text-gray-800 border-2 border-[#6f2d91] rounded-xl outline-none"
            />
            <button
                onClick={handleAddInterest}
                className="px-4 py-2 text-lg text-white bg-[#6f2d91] rounded-xl"
            >
                +
            </button>
            </div>
        </div>

        {/* Buscando */}
        <div className="mt-6">
            <h3 className="text-base font-bold mb-2 text-gray-800">Buscando</h3>

            <div className="flex flex-col gap-4 mt-2">
            {Object.entries(lookingFor).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700 capitalize">
                    {key}
                </span>

                <input
                    type="checkbox"
                    checked={value}
                    onChange={() => handleToggle(key)}
                    className="w-5 h-5 accent-[#6f2d91] cursor-pointer"
                />
                </div>
            ))}
            </div>
        </div>

        {/* Guardar */}
        <div className="flex justify-center mt-8 mb-6">
            <Button onClick={handleSave}>
            Guardar cambios
            </Button>
        </div>

        </div>
    );
}