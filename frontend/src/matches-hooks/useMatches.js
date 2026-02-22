// matches-hooks/useMatches.js

import { useEffect, useState } from "react";
import { matchesService } from "../matches-services/matchesService";

export const useMatches = () => {

  const [matches, setMatches] = useState([]);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loadingMatches, setLoadingMatches] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [error, setError] = useState(null);

  // Cargar lista de matches
  const loadMatches = async () => {
    try {
      setLoadingMatches(true);
      const data = await matchesService.getMatches();
      setMatches(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingMatches(false);
    }
  };

  // Seleccionar match y cargar mensajes
  const selectMatch = async (match) => {
    setSelectedMatch(match);
    await loadMessages(match.id);
  };

  // Cargar mensajes de un match
  const loadMessages = async (matchId) => {
    try {
      setLoadingMessages(true);
      const data = await matchesService.getMessages(matchId);
      setMessages(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingMessages(false);
    }
  };

  // Enviar mensaje
  const sendMessage = async (content) => {
    if (!selectedMatch) return;

    const newMessage = {
      content,
      sender: "me", // -> auth
      timestamp: new Date().toISOString(),
    };

    try {
      const savedMessage = await matchesService.sendMessage(
        selectedMatch.id,
        newMessage
      );

      // Optimistic update
      setMessages((prev) => [...prev, savedMessage]);
    } catch (err) {
      setError(err.message);
    }
  };

  // Cargar matches al montar
  useEffect(() => {
    loadMatches();
  }, []);

  return {
    matches,
    selectedMatch,
    messages,
    loadingMatches,
    loadingMessages,
    error,
    selectMatch,
    sendMessage,
  };
};