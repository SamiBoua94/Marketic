"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { User, Camera, Calendar, FileText, Loader2, Check, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/auth-context";

export default function ProfilePage() {
    const router = useRouter();
    const { user, loading, updateProfile, logout } = useAuth();
    const [editing, setEditing] = useState(false);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [profilePicture, setProfilePicture] = useState("");
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (!loading && !user) {
            router.push("/login");
        }
        if (user) {
            setName(user.name);
            setDescription(user.description || "");
            setProfilePicture(user.profilePicture || "");
        }
    }, [user, loading, router]);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        setError("");

        try {
            const formData = new FormData();
            formData.append('file', file);

            const res = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || 'Erreur lors du téléchargement');
                return;
            }

            setProfilePicture(data.url);
        } catch {
            setError('Erreur lors du téléchargement');
        } finally {
            setUploading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        setError("");
        const result = await updateProfile({ name, description, profilePicture });
        setSaving(false);
        if (result.success) {
            setEditing(false);
            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
        } else {
            setError(result.error || "Erreur lors de la mise à jour");
        }
    };

    const handleLogout = async () => {
        await logout();
        router.push("/");
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("fr-FR", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    if (loading) {
        return (
            <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!user) return null;

    return (
        <div className="min-h-[calc(100vh-4rem)] py-12 px-4 bg-background">
            <div className="max-w-2xl mx-auto">
                <h1 className="text-3xl font-bold font-heading text-foreground mb-8">Mon Profil</h1>

                {success && (
                    <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg flex items-center gap-2">
                        <Check className="w-5 h-5" />
                        Profil mis à jour avec succès !
                    </div>
                )}

                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg">
                        {error}
                    </div>
                )}

                <div className="bg-white rounded-2xl shadow-lg border border-secondary/20 p-8">
                    {/* Profile Picture */}
                    <div className="flex flex-col items-center mb-8">
                        <div className="relative">
                            {profilePicture ? (
                                <img
                                    src={profilePicture}
                                    alt={name}
                                    className="w-32 h-32 rounded-full object-cover border-4 border-primary/20"
                                />
                            ) : (
                                <div className="w-32 h-32 rounded-full bg-secondary/20 flex items-center justify-center border-4 border-primary/20">
                                    <User className="w-16 h-16 text-foreground/40" />
                                </div>
                            )}
                            {editing && (
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    disabled={uploading}
                                    className="absolute bottom-0 right-0 p-2 bg-primary text-white rounded-full shadow-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
                                >
                                    {uploading ? (
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                    ) : (
                                        <Camera className="w-5 h-5" />
                                    )}
                                </button>
                            )}
                        </div>

                        {/* Hidden file input */}
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/jpeg,image/png,image/gif,image/webp"
                            onChange={handleFileChange}
                            className="hidden"
                        />

                        {editing && (
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                disabled={uploading}
                                className="mt-4 flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors disabled:opacity-50"
                            >
                                <Upload className="w-4 h-4" />
                                {uploading ? "Téléchargement..." : "Choisir une photo"}
                            </button>
                        )}
                    </div>

                    {/* User Info */}
                    <div className="space-y-6">
                        {/* Name */}
                        <div>
                            <label className="flex items-center gap-2 text-sm font-medium text-foreground/70 mb-1.5">
                                <User className="w-4 h-4" />
                                Nom
                            </label>
                            {editing ? (
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full px-4 py-3 rounded-lg border border-secondary/30 bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                                />
                            ) : (
                                <p className="text-lg font-medium text-foreground">{user.name}</p>
                            )}
                        </div>

                        {/* Email */}
                        <div>
                            <label className="flex items-center gap-2 text-sm font-medium text-foreground/70 mb-1.5">
                                Email
                            </label>
                            <p className="text-lg text-foreground">{user.email}</p>
                        </div>

                        {/* Description */}
                        <div>
                            <label className="flex items-center gap-2 text-sm font-medium text-foreground/70 mb-1.5">
                                <FileText className="w-4 h-4" />
                                Description
                            </label>
                            {editing ? (
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Parlez-nous de vous..."
                                    rows={4}
                                    className="w-full px-4 py-3 rounded-lg border border-secondary/30 bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all resize-none"
                                />
                            ) : (
                                <p className="text-foreground">
                                    {user.description || <span className="text-foreground/50 italic">Aucune description</span>}
                                </p>
                            )}
                        </div>

                        {/* Member Since */}
                        <div>
                            <label className="flex items-center gap-2 text-sm font-medium text-foreground/70 mb-1.5">
                                <Calendar className="w-4 h-4" />
                                Membre depuis
                            </label>
                            <p className="text-lg text-foreground">{formatDate(user.createdAt)}</p>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="mt-8 flex flex-col sm:flex-row gap-4">
                        {editing ? (
                            <>
                                <Button onClick={handleSave} disabled={saving || uploading} className="flex-1">
                                    {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : "Enregistrer"}
                                </Button>
                                <Button variant="outline" onClick={() => setEditing(false)} className="flex-1">
                                    Annuler
                                </Button>
                            </>
                        ) : (
                            <>
                                <Button onClick={() => setEditing(true)} className="flex-1">
                                    Modifier mon profil
                                </Button>
                                <Button variant="outline" onClick={handleLogout} className="flex-1">
                                    Se déconnecter
                                </Button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
