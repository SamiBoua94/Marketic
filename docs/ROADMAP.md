# Marketic : Roadmap d'implémentation

Ce document récapitule l'état actuel du projet et les fonctionnalités restant à implémenter.

## 1. Gestion de la Boutique (Vendeurs)

### 🏗️ En cours / À finaliser
- [x] **Système d'ouverture de boutique** : Le lien dynamique "Ouvrir ma boutique" / "Gérer ma boutique" dans le menu profil est présent.
- [x] **Formulaire de création** : Présent avec Nom, Description, Adresse, Email, Téléphone.
- [x] **Gestion des images** : Upload de la photo de profil, bannière et certificat (Prisma OK, Formulaire OK).
- [X] **Champs légaux et contact** :
    - [X] Ajout du champ **N° SIRET**.
    - [X] Ajout des champs **Réseaux sociaux** (Instagram, Facebook, etc.).
- [X] **Certificat de conformité** : Emplacement pour le QR Code (Actuellement une image simple).

### 🚀 À implémenter
- [ ] **Gestion des articles (Produits)** :
    - [ ] Création du modèle `Product` dans la base de données.
    - [ ] Bouton "Ajouter un article" dans l'espace boutique.
    - [ ] Formulaire d'ajout d'article (Nom, Prix, Description, Stock, Images).
    - [ ] Liste des articles existants avec option Modifier / Supprimer.

## 2. Profil Utilisateur

- [x] **Informations de base** : Nom, Email, Photo de profil, Description.
- [ ] **Historique des commandes** : (À prévoir ultérieurement).
- [ ] **Mes favoris** : (À prévoir ultérieurement).

## 3. Marketplace (Côté Acheteur)

- [x] **Page d'accueil** : Design moderne avec catégories et sections "À la une".
- [ ] **Catalogue** : Liste complète des produits avec filtres (Éco-score, Localisation, Catégorie).
- [ ] **Page Produit** : Détails, avis, informations sur l'artisan.
- [ ] **Panier** : Gestion du panier d'achat.
- [ ] **Paiement** : Intégration d'un système de paiement (Stripe, etc.).

## 4. Technique & Correctifs

- [ ] **Validation des données** : Renforcer les validations côté serveur (Zod/Prisma).
- [ ] **Optimisation images** : Utilisation de Next/Image pour toutes les photos chargées par les utilisateurs.
- [ ] **SEO** : Optimisation des balises meta pour les pages boutiques et produits.

---

> [!TIP]
> **Priorité immédiate** : Mise à jour du schéma de base de données pour inclure les nouveaux champs boutique (SIRET, Réseaux) et le modèle Produit, puis développement du bouton "Ajouter un article".
