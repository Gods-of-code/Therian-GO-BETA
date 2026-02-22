import { createContext, useContext, useState } from "react";

const ProfileContext = createContext();

export function ProfileProvider({ children }) {
    const [profile, setProfile] = useState({
        name: "thomas",
        type: "wolf",
        age: 19,
        city: "Pereira",
        searching: ["amistad", "pareja"],
        bio: "Cuentale a los demás algo sobre ti!",
        interests: ["Música", "Viajes", "Deportes"],
        photoUrl: null,
        photos: [
            "https://picsum.photos/200",
            "https://picsum.photos/201",
            "https://picsum.photos/202",
        ],
    });

    return (
        <ProfileContext.Provider value={{ profile, setProfile }}>
            {children}
        </ProfileContext.Provider>
    );
}

export function useProfile() {
    return useContext(ProfileContext);
}