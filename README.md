# AI Client

Ce projet est un client AI qui se connecte à un modèle LLM auto-hébergé via LM Studio. Il permet d'analyser, générer et aider à écrire du code pour divers projets.

## Fonctionnalités prévues
- Connexion à LM Studio (API locale)
- Interface utilisateur moderne (React)
- Backend (Python FastAPI)
- Analyse et génération de code

## Démarrage rapide
1. Installer les dépendances backend : `pip install -r requirements.txt`
2. Installer les dépendances frontend : `cd frontend && npm install`
3. Lancer le backend : `uvicorn main:app --reload`
4. Lancer le frontend : `cd frontend && npm start`

## Configuration
- Assurez-vous que LM Studio est lancé et accessible via son API locale.

## Structure du projet
- `backend/` : API FastAPI pour communiquer avec LM Studio
- `frontend/` : Interface utilisateur React

## À venir
- Documentation détaillée
- Exemples d'utilisation
