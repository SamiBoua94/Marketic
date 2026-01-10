import { GoogleGenerativeAI } from '@google/generative-ai';

// Configuration pour l'API Gemini
// En production, utilisez des variables d'environnement pour la clé API
const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY || 'votre-clé-api-ici';

// Initialisation du client Gemini
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

export interface ChatMessage {
  role: 'user' | 'model';
  content: string;
}

export class GeminiService {
  private model: any;

  constructor() {
    // Utilisation du modèle gemini-pro pour le chat
    this.model = genAI.getGenerativeModel({ model: 'gemini-pro' });
  }

  /**
   * Envoie un message à Gemini et obtient une réponse
   * @param message Le message de l'utilisateur
   * @param history L'historique de conversation (optionnel)
   * @returns La réponse de l'IA
   */
  async sendMessage(message: string, history: ChatMessage[] = []): Promise<string> {
    try {
      // Création du contexte pour Markethic
      const context = `Tu es un assistant IA pour Markethic, une plateforme qui connecte les consommateurs avec des artisans locaux. 
      Ton rôle est d'aider les utilisateurs à:
      - Découvrir les artisans et leurs produits
      - Comprendre les techniques artisanales
      - Naviguer sur la plateforme Markethic
      - Obtenir des recommandations personnalisées
      
      Sois toujours amical, professionnel et informatif. Si tu ne connais pas la réponse, sois honnête et suggère de contacter le support Markethic.
      Réponds en français.`;

      // Construction du prompt complet
      const fullPrompt = `${context}\n\nConversation précédente:\n${history.map(msg => `${msg.role}: ${msg.content}`).join('\n')}\n\nUtilisateur: ${message}\n\nAssistant:`;

      const result = await this.model.generateContent(fullPrompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Erreur lors de l\'appel à Gemini:', error);
      throw new Error('Désolé, je ne peux pas répondre pour le moment. Veuillez réessayer plus tard.');
    }
  }

  /**
   * Vérifie si l'API Gemini est disponible
   * @returns true si l'API est configurée et disponible
   */
  isAvailable(): boolean {
    return GEMINI_API_KEY !== 'votre-clé-api-ici' && GEMINI_API_KEY.length > 0;
  }
}

// Export d'une instance singleton
export const geminiService = new GeminiService();
