
import React, { useState } from "react";

const MatchesTabs = ({ children }) => {
  const [activeTab, setActiveTab] = useState("chats");

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <button
          className={`px-3 py-1 rounded-md text-sm font-medium ${activeTab === "chats"
              ? "bg-indigo-600 text-white"
              : "bg-gray-100 text-gray-700"
            }`}
          onClick={() => setActiveTab("chats")}
        >
          Mensajes
        </button>

        <button
          className={`px-3 py-1 rounded-md text-sm font-medium ${activeTab === "new"
              ? "bg-indigo-600 text-white"
              : "bg-gray-100 text-gray-700"
            }`}
          onClick={() => setActiveTab("new")}
        >
          Nuevos
        </button>
      </div>

      <div className="w-full">
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