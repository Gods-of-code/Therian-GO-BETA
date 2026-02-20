// services/matchesService.js
/*
Idea: Defini rutas generales para luego conectarla correctamente
a los endpoints.
*/

const API_URL = "http://localhost:8000/api"; 
// luego podemos pasar esto a variables de entorno

export const matchesService = {

  async getMatches() {
    const response = await fetch(`${API_URL}/matches`);
    if (!response.ok) {
      throw new Error("Error fetching matches");
    }
    return response.json();
  },

  async getMessages(matchId) {
    const response = await fetch(`${API_URL}/matches/${matchId}/messages`);
    if (!response.ok) {
      throw new Error("Error fetching messages");
    }
    return response.json();
  },

  async sendMessage(matchId, message) {
    const response = await fetch(`${API_URL}/matches/${matchId}/messages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(message),
    });

    if (!response.ok) {
      throw new Error("Error sending message");
    }

    return response.json();
  }

};