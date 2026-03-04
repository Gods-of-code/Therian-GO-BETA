import ChatItem from "./ChatItem";

const ChatList = ({ matches, selectedMatch, selectMatch, loadingMatches }) => {
  if (loadingMatches) {
    return (
      <div className="chat-list-loading">
        <div className="chat-spinner" />
      </div>
    );
  }

  if (!matches || matches.length === 0) {
    return (
      <div className="chat-list-empty">
        <p>Aún no hay conversaciones.</p>
      </div>
    );
  }

  return (
    <div className="chat-list">
      {matches.map((match) => (
        <ChatItem
          key={match.id}
          match={match}
          isActive={selectedMatch?.id === match.id}
          onClick={() => selectMatch(match)}
        />
      ))}
    </div>
  );
};

export default ChatList;