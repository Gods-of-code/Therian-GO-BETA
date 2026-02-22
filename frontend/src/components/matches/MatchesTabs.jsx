// components/matches/MatchesTabs.jsx

import React, { useState } from "react";

const MatchesTabs = ({ children }) => {
  const [activeTab, setActiveTab] = useState("chats");

  return (
    <div className="matches-tabs-container">
      
      <div className="tabs-header">
        <button
          className={activeTab === "chats" ? "active" : ""}
          onClick={() => setActiveTab("chats")}
        >
          Mensajes
        </button>

        <button
          className={activeTab === "new" ? "active" : ""}
          onClick={() => setActiveTab("new")}
        >
          Nuevos
        </button>
      </div>

      <div className="tabs-content">
        {React.Children.map(children, (child) => {
          if (child.props.name === activeTab) {
            return child;
          }
          return null;
        })}
      </div>
    </div>
  );
};

export default MatchesTabs;