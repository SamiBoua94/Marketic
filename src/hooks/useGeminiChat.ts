import { useState, useCallback } from 'react';
import { geminiService, ChatMessage } from '@/lib/gemini';

interface UseGeminiChatReturn {
  messages: ChatMessage[];
  isLoading: boolean;
  error: string | null;
  sendMessage: (message: string) => Promise<void>;
  clearMessages: () => void;
  isGeminiAvailable: boolean;
}

export function useGeminiChat(): UseGeminiChatReturn {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = useCallback(async (userMessage: string) => {
    if (!userMessage.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      // Ajout du message utilisateur à l'historique
      const newUserMessage: ChatMessage = {
        role: 'user',
        content: userMessage.trim()
      };

      const updatedMessages = [...messages, newUserMessage];
      setMessages(updatedMessages);

      // Vérification si Gemini est disponible
      if (!geminiService.isAvailable()) {
        // Utilisation des mocks si Gemini n'est pas configuré
        const mockResponses = [
          "C'est une excellente question ! Nos artisans sont passionnés par leur métier et proposent des produits uniques. Je vous recommande de consulter notre catalogue pour découvrir leurs créations.",
          "Je comprends votre demande. Markethic connecte les consommateurs avec des artisans locaux talentueux. Chaque produit raconte une histoire unique.",
          "Merci pour votre intérêt ! Nos artisans utilisent des techniques traditionnelles et des matériaux de qualité pour créer des pièces exceptionnelles.",
          "C'est une très bonne idée ! Je peux vous aider à trouver l'artisan parfait pour votre projet. Quels types de produits vous intéressent le plus ?",
          "Absolument ! Notre plateforme met en valeur le savoir-faire artisanal local. Chaque achat soutient directement les artisans de votre région."
        ];
        
        const mockResponse = mockResponses[Math.floor(Math.random() * mockResponses.length)];
        
        setTimeout(() => {
          const assistantMessage: ChatMessage = {
            role: 'model',
            content: mockResponse
          };
          setMessages(prev => [...prev, assistantMessage]);
          setIsLoading(false);
        }, 1000 + Math.random() * 1000);
        
        return;
      }

      // Appel à l'API Gemini
      const response = await geminiService.sendMessage(userMessage, messages);
      
      const assistantMessage: ChatMessage = {
        role: 'model',
        content: response
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Une erreur est survenue';
      setError(errorMessage);
      
      // En cas d'erreur, on ajoute quand même un message de l'assistant
      const errorMessageChat: ChatMessage = {
        role: 'model',
        content: 'Désolé, je rencontre des difficultés techniques. Veuillez réessayer plus tard ou contacter notre support.'
      };
      setMessages(prev => [...prev, errorMessageChat]);
    } finally {
      setIsLoading(false);
    }
  }, [messages]);

  const clearMessages = useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    clearMessages,
    isGeminiAvailable: geminiService.isAvailable()
  };
}
