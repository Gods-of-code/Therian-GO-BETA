import MatchesTabs from "../components/matches/MatchesTabs";
import ChatList from "../components/matches/ChatList";
import ChatItem from "../components/matches/ChatItem";

export default function Matches() {
    return (
        <MatchesTabs>
            <div name="chats"> 
                <ChatList></ChatList>
            </div>

            <div name="new">
                {/* <NewMatchCard */} 
            </div>
        </MatchesTabs>
    );
}