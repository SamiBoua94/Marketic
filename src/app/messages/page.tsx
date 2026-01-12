"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { MessageSquare, Search, Send, User, Loader2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/auth-context";

export default function MessagesPage() {
    const router = useRouter();
    const { user, loading } = useAuth();
    const [selectedChat, setSelectedChat] = useState<number | null>(null);

    useEffect(() => {
        if (!loading && !user) {
            router.push("/login");
        }
    }, [user, loading, router]);

    if (loading) {
        return (
            <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!user) return null;

    // Mock data for messages
    const chats = [
        {
            id: 1,
            name: "Support Markethic",
            lastMessage: "Comment pouvons-nous vous aider aujourd'hui ?",
            time: "10:30",
            unread: 1,
            avatar: null,
            online: true
        },
        {
            id: 2,
            name: "Boutique Bio & Co",
            lastMessage: "Votre commande est en cours de préparation.",
            time: "Hier",
            unread: 0,
            avatar: null,
            online: false
        }
    ];

    return (
        <div className="min-h-[calc(100vh-4rem)] bg-background flex flex-col">
            <div className="max-w-6xl mx-auto w-full flex-1 flex flex-col md:flex-row p-4 md:p-8 gap-6">

                {/* Sidebar - Chat List */}
                <div className="w-full md:w-80 lg:w-96 flex flex-col bg-white rounded-2xl shadow-lg border border-secondary/20 overflow-hidden">
                    <div className="p-6 border-b border-secondary/10">
                        <div className="flex items-center justify-between mb-6">
                            <h1 className="text-2xl font-bold font-heading text-foreground">Messages</h1>
                            <Button variant="ghost" size="sm" onClick={() => router.push('/')} className="md:hidden">
                                <ArrowLeft className="w-5 h-5" />
                            </Button>
                        </div>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/40" />
                            <input
                                type="text"
                                placeholder="Rechercher une conversation..."
                                className="w-full pl-10 pr-4 py-2.5 bg-secondary/5 border border-secondary/20 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                            />
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto">
                        {chats.map((chat) => (
                            <button
                                key={chat.id}
                                onClick={() => setSelectedChat(chat.id)}
                                className={`w-full p-4 flex items-center gap-4 hover:bg-secondary/5 transition-colors border-l-4 ${selectedChat === chat.id ? 'bg-secondary/10 border-primary' : 'border-transparent'}`}
                            >
                                <div className="relative">
                                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
                                        <User className="w-6 h-6 text-primary" />
                                    </div>
                                    {chat.online && (
                                        <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
                                    )}
                                </div>
                                <div className="flex-1 text-left min-w-0">
                                    <div className="flex justify-between items-start mb-1">
                                        <p className="font-semibold text-foreground truncate">{chat.name}</p>
                                        <span className="text-xs text-foreground/40">{chat.time}</span>
                                    </div>
                                    <p className="text-sm text-foreground/60 truncate">{chat.lastMessage}</p>
                                </div>
                                {chat.unread > 0 && (
                                    <span className="bg-primary text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                                        {chat.unread}
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Main Content - Chat Window */}
                <div className="flex-1 flex flex-col bg-white rounded-2xl shadow-lg border border-secondary/20 overflow-hidden min-h-[500px]">
                    {selectedChat ? (
                        <>
                            {/* Chat Header */}
                            <div className="p-4 border-b border-secondary/10 flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                    <User className="w-5 h-5 text-primary" />
                                </div>
                                <div>
                                    <p className="font-semibold text-foreground">
                                        {chats.find(c => c.id === selectedChat)?.name}
                                    </p>
                                    <p className="text-xs text-green-500 font-medium">En ligne</p>
                                </div>
                            </div>

                            {/* Messages Area */}
                            <div className="flex-1 p-6 overflow-y-auto flex flex-col gap-4 bg-secondary/5">
                                <div className="self-start max-w-[80%] bg-white p-4 rounded-2xl rounded-tl-none shadow-sm border border-secondary/10">
                                    <p className="text-sm text-foreground">
                                        {chats.find(c => c.id === selectedChat)?.lastMessage}
                                    </p>
                                    <p className="text-[10px] text-foreground/40 mt-1">10:30</p>
                                </div>

                                <div className="self-end max-w-[80%] bg-primary text-white p-4 rounded-2xl rounded-tr-none shadow-sm">
                                    <p className="text-sm">
                                        Bonjour ! J'aimerais avoir plus d'informations sur vos produits.
                                    </p>
                                    <p className="text-[10px] opacity-70 mt-1 text-right">10:35</p>
                                </div>
                            </div>

                            {/* Message Input */}
                            <div className="p-4 border-t border-secondary/10 bg-white">
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        placeholder="Écrivez votre message..."
                                        className="flex-1 px-4 py-2.5 bg-secondary/5 border border-secondary/20 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                    />
                                    <Button className="shrink-0">
                                        <Send className="w-5 h-5" />
                                    </Button>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-foreground/40">
                            <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mb-4">
                                <MessageSquare className="w-8 h-8" />
                            </div>
                            <h2 className="text-xl font-semibold text-foreground mb-2">Vos conversations</h2>
                            <p className="max-w-xs">
                                Sélectionnez une conversation pour commencer à discuter avec des vendeurs ou le support.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
