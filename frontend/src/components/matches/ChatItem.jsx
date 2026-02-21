// components/matches/ChatItem.jsx

import React from "react";

const ChatItem = ({ match, isActive, onClick }) => {
  return (
    <div
      className={`chat-item ${isActive ? "active" : ""}`}
      onClick={onClick}
    >
      <img
        src={match.avatar || "/default-avatar.png"}
        alt={match.name}
        className="chat-avatar"
      />

      <div className="chat-info">
        <div className="chat-header">
          <h4 className="chat-name">{match.name}</h4>
          {match.lastMessageTime && (
            <span className="chat-time">
              {formatTime(match.lastMessageTime)}
            </span>
          )}
        </div>

        <p className="chat-last-message">
          {match.lastMessage || "Start a conversation"}
        </p>
      </div>
    </div>
  );
};


const formatTime = (timestamp) => {
  const date = new Date(timestamp);
  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
};

export default ChatItem;