"use client";

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Send, Bot, User, Sparkles, AlertCircle } from 'lucide-react';
import { useGeminiChat } from '@/hooks/useGeminiChat';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

export default function ChatIAPage() {
  const { messages: chatMessages, isLoading, error, sendMessage, isGeminiAvailable } = useGeminiChat();
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Conversion des messages du hook vers le format local
  const messages: Message[] = [
    {
      id: 'welcome',
      content: isGeminiAvailable 
        ? 'Bonjour ! Je suis votre assistant IA Markethic, alimenté par Google Gemini. Je suis là pour vous aider à découvrir nos artisans locaux, vous conseiller sur les produits artisanaux, ou répondre à toutes vos questions sur notre plateforme. Comment puis-je vous aider aujourd\'hui ?'
        : 'Bonjour ! Je suis votre assistant IA pour Markethic. Je fonctionne actuellement en mode démo. Je suis là pour vous aider à découvrir nos artisans locaux et vous conseiller sur les produits artisanaux. Comment puis-je vous aider aujourd\'hui ?',
      role: 'assistant',
      timestamp: new Date()
    },
    ...chatMessages.map((msg, index) => ({
      id: `msg-${index}`,
      content: msg.content,
      role: msg.role === 'user' ? 'user' as const : 'assistant' as const,
      timestamp: new Date()
    }))
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;
    
    await sendMessage(inputValue.trim());
    setInputValue('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="p-3 bg-primary/10 rounded-full">
              <Sparkles className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-3xl font-bold text-foreground">Assistant IA Markethic</h1>
          </div>
          <p className="text-foreground/70 max-w-2xl mx-auto">
            Discutez avec notre intelligence artificielle pour découvrir les artisans locaux, 
            obtenir des recommandations personnalisées et en savoir plus sur nos produits artisanaux.
          </p>
          
          {/* Status Banner */}
          <div className={`mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm ${
            isGeminiAvailable 
              ? 'bg-green-100 text-green-800' 
              : 'bg-yellow-100 text-yellow-800'
          }`}>
            {isGeminiAvailable ? (
              <>
                <div className="w-2 h-2 bg-green-600 rounded-full animate-pulse" />
                <span>Alimenté par Google Gemini ✨</span>
              </>
            ) : (
              <>
                <AlertCircle className="w-4 h-4" />
                <span>Mode démo - Configurez votre clé API Gemini</span>
              </>
            )}
          </div>
        </div>

        {/* Chat Container */}
        <div className="bg-white rounded-2xl shadow-xl border border-secondary/20 overflow-hidden">
          {/* Messages Area */}
          <div className="h-[500px] overflow-y-auto p-6 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {message.role === 'assistant' && (
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Bot className="w-5 h-5 text-primary" />
                  </div>
                )}
                
                <div
                  className={`max-w-[70%] rounded-2xl px-4 py-3 ${
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-secondary/10 text-foreground'
                  }`}
                >
                  <p className="text-sm leading-relaxed">{message.content}</p>
                  <p className="text-xs opacity-60 mt-1">
                    {message.timestamp.toLocaleTimeString('fr-FR', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>

                {message.role === 'user' && (
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                    <User className="w-5 h-5 text-primary-foreground" />
                  </div>
                )}
              </div>
            ))}
            
            {isLoading && (
              <div className="flex gap-3 justify-start">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <Bot className="w-5 h-5 text-primary" />
                </div>
                <div className="bg-secondary/10 rounded-2xl px-4 py-3">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-foreground/40 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-foreground/40 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                    <div className="w-2 h-2 bg-foreground/40 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="border-t border-secondary/20 p-4">
            <div className="flex gap-3">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Tapez votre message ici..."
                className="flex-1 px-4 py-3 bg-secondary/10 border border-secondary/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all"
                disabled={isLoading}
              />
              <Button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isLoading}
                size="sm"
                className="px-4 py-3"
              >
                <Send className="w-5 h-5" />
                <span className="sr-only">Envoyer</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Info Section */}
        <div className="mt-8 text-center">
          <p className="text-sm text-foreground/60">
            💡 <strong>Astuce :</strong> Posez-moi des questions sur les artisans, les produits, 
            les techniques artisanales ou comment commander sur Markethic.
          </p>
        </div>
      </div>
    </div>
  );
}
