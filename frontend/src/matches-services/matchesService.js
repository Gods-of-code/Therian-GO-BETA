const API_URL = "http://localhost:8000";

const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return {
        "Content-Type": "application/json",
        ...(token && { "Authorization": `Bearer ${token}` }),
    };
};

export const matchesService = {
    async getMatches() {
        const response = await fetch(`${API_URL}/matches`, {
            headers: getAuthHeaders(),
        });
        if (!response.ok) {
            throw new Error("Error fetching matches");
        }
        return response.json();
    },

    async sendMessage(matchId, message) {
        const response = await fetch(`${API_URL}/matches/${matchId}/messages`, {
            method: "POST",
            headers: getAuthHeaders(),
            body: JSON.stringify(message),
        });

        if (!response.ok) {
            throw new Error("Error sending message");
        }
        return response.json();
    }
};