import React from "react";

const ChatItem = ({ match, isActive, onClick }) => {
  return (
    <div onClick={onClick} className={`chat-item ${isActive ? "chat-item-active" : ""}`}>
      <div className="chat-item-avatar-wrap">
        <img
          src={match.avatar || "https://i.pravatar.cc/150"}
          alt={match.name}
          className="chat-item-avatar"
        />
        <span className="chat-item-online-dot" />
      </div>
      <div className="chat-item-body">
        <div className="chat-item-top">
          <h4 className="chat-item-name">{match.name}</h4>
          {match.lastMessageTime && (
            <span className="chat-item-time">{formatTime(match.lastMessageTime)}</span>
          )}
        </div>
        <p className="chat-item-preview">
          {match.lastMessage || "Empieza una conversación"}
        </p>
      </div>
    </div>
  );
};

const formatTime = (timestamp) => {
  const date = new Date(timestamp);
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

export default ChatItem;