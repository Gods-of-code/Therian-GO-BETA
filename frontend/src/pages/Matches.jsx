import { useState } from "react";
import "./Matches.css";
import ChatList from "../components/matches/ChatList";
import ChatWindow from "../components/matches/ChatWindow";

export default function Matches() {
    const sampleMatches = [
        {
            id: "1",
            name: "Alex",
            avatar: "https://i.pravatar.cc/150?img=12",
            lastMessage: "Hey! ¿Quieres quedar este fin de semana?",
            lastMessageTime: Date.now() - 1000 * 60 * 60 * 2,
        },
        {
            id: "2",
            name: "María",
            avatar: "https://i.pravatar.cc/150?img=5",
            lastMessage: "Me encantó tu foto en la playa 😄",
            lastMessageTime: Date.now() - 1000 * 60 * 15,
        },
        {
            id: "3",
            name: "Carlos",
            avatar: "https://i.pravatar.cc/150?img=7",
            lastMessage: "¿Viste el partido ayer?",
            lastMessageTime: Date.now() - 1000 * 60 * 60 * 5,
        },
        {
            id: "4",
            name: "Laura",
            avatar: "https://i.pravatar.cc/150?img=8",
            lastMessage: "¡Feliz cumpleaños! 🎉",
            lastMessageTime: Date.now() - 1000 * 60 * 60 * 24,
        },
        {
            id: "5",
            name: "Javier",
            avatar: "https://i.pravatar.cc/150?img=9",
            lastMessage: "Nos vemos mañana en la reunión.",
            lastMessageTime: Date.now() - 1000 * 60 * 30,
        },
        {
            id: "6",
            name: "Sofía",
            avatar: "https://i.pravatar.cc/150?img=10",
            lastMessage: "¿Ya probaste ese restaurante nuevo?",
            lastMessageTime: Date.now() - 1000 * 60 * 60 * 10,
        },
    ];

    const [selectedMatch, setSelectedMatch] = useState(null);
    const [matches] = useState(sampleMatches);
    const [isLoading] = useState(false);

    if (selectedMatch) {
        return (
            <ChatWindow
                match={selectedMatch}
                onBack={() => setSelectedMatch(null)}
            />
        );
    }

    return (
        <div className="matches-page">
            <div className="matches-new-strip">
                <h3 className="matches-section-title">Nuevos Matches</h3>
                <div className="matches-avatars-row">
                    {matches.slice(0, 6).map((m) => (
                        <div
                            key={`new-${m.id}`}
                            className="matches-avatar-item"
                            onClick={() => setSelectedMatch(m)}
                        >
                            <div className="matches-avatar-ring">
                                <img
                                    src={m.avatar || "https://i.pravatar.cc/150"}
                                    alt={m.name}
                                    className="matches-avatar-img"
                                />
                            </div>
                            <span className="matches-avatar-name">
                                {m.name.split(" ")[0]}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="matches-chat-section">
                <h3 className="matches-section-title">Mensajes</h3>
                <ChatList
                    matches={matches}
                    selectedMatch={selectedMatch}
                    selectMatch={(m) => setSelectedMatch(m)}
                    loadingMatches={isLoading}
                />
            </div>
        </div>
    );
}