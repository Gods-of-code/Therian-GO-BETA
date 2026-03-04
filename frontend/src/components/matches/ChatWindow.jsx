import React, { useState, useEffect, useRef } from "react";

const ChatWindow = ({ match, onBack }) => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const messagesEndRef = useRef(null);
    const jwtToken = localStorage.getItem("token");
    const profileId = localStorage.getItem("profileId");

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    useEffect(() => {
        if (!match) return;

        setLoading(true);
        setMessages([]);

        const fetchMessages = async () => {
            try {
                const res = await fetch(
                    `http://localhost:8000/messages/?match_id=${match.id}&limit=100`,
                    { headers: { Authorization: `Bearer ${jwtToken}` } }
                );
                if (res.ok) {
                    const data = await res.json();
                    setMessages(data);
                }
            } catch (err) {
                console.error("Failed to fetch messages:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchMessages();

        const wsUrl = `ws://localhost:8000/messages/ws/${match.id}?token=${jwtToken}`;
        const ws = new WebSocket(wsUrl);

        ws.onmessage = (event) => {
            const message = JSON.parse(event.data);
            if (message.id) {
                setMessages((prev) => [...prev, message]);
            }
        };

        return () => ws.close();
    }, [match]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        try {
            const res = await fetch("http://localhost:8000/messages/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${jwtToken}`,
                },
                body: JSON.stringify({ match_id: match.id, body: newMessage }),
            });

            if (res.ok) {
                setNewMessage("");
            }
        } catch (err) {
            console.error("Failed to send message", err);
        }
    };

    const formatTime = (isoString) => {
        const date = new Date(isoString);
        return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    };

    if (!match) return null;

    return (
        <div className="chat-window">
            <div className="chat-window-header">
                <button onClick={onBack} className="chat-back-btn">
                    <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
                <img
                    src={match.avatar || "https://i.pravatar.cc/150"}
                    alt={match.name}
                    className="chat-header-avatar"
                />
                <div className="chat-header-info">
                    <h3 className="chat-header-name">{match.name}</h3>
                    <span className="chat-header-status">En línea</span>
                </div>
            </div>

            <div className="chat-messages-area">
                {loading ? (
                    <div className="chat-loading">
                        <div className="chat-spinner" />
                    </div>
                ) : messages.length === 0 ? (
                    <div className="chat-empty">
                        <div className="chat-empty-icon">👋</div>
                        <p>¡Di hola para empezar!</p>
                    </div>
                ) : (
                    messages.map((msg, idx) => {
                        const isMe = msg.sender_profile === profileId;
                        return (
                            <div
                                key={msg.id || idx}
                                className={`chat-bubble-row ${isMe ? "chat-bubble-mine" : "chat-bubble-theirs"}`}
                            >
                                <div className={`chat-bubble ${isMe ? "bubble-sent" : "bubble-received"}`}>
                                    <p>{msg.body}</p>
                                </div>
                                <span className="chat-bubble-time">
                                    {formatTime(msg.sent_at)}
                                </span>
                            </div>
                        );
                    })
                )}
                <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSendMessage} className="chat-input-bar">
                <div className="chat-input-wrapper">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Escribe un mensaje..."
                        className="chat-input"
                    />
                </div>
                <button
                    type="submit"
                    disabled={!newMessage.trim()}
                    className="chat-send-btn"
                >
                    <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                </button>
            </form>
        </div>
    );
};

export default ChatWindow;
