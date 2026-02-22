// matches-services/matchesService.js
/*
Idea: defini rutas generales para luego conectarla correctamente
a los endpoints.

Uso: comunicación directa al backend (llamadas HTTP), capa de acceso a API ->
no maneja estados, ni contiene logica de aplicación.
*/

const API_URL = "http://localhost:8000"; 

// Luego podemos pasar esto a variables de entorno

export const matchesService = {

  async getMatches() {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_URL}/matches`, {
    headers: {
      "Authorization": `Bearer ${token}`
    }
  });

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