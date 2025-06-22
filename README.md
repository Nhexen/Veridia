# Veridia - Client AI 

Un client AI moderne qui se connecte à un modèle LLM auto-hébergé via LM Studio. Il permet d'analyser, générer et aider à écrire du code pour divers projets de développement.

## ✨ Fonctionnalités

### 🎨 Interface Utilisateur
- **Design Apple-like** avec typographie SF Pro Text
- **Interface chat moderne** avec messages en temps réel
- **Rendu Markdown avancé** avec coloration syntaxique
- **Animations fluides** et transitions élégantes
- **Background fixe** qui ne bouge pas lors du scroll
- **Responsive design** adaptatif

### 🤖 Fonctionnalités IA
- **Connexion LM Studio** (API locale auto-hébergée)
- **Support Markdown complet** dans les réponses
- **Coloration syntaxique** pour tous les langages
- **Historique des conversations** persistant
- **Statistiques détaillées** (tokens, temps de réponse)

### 🔧 Fonctionnalités Techniques
- **Backend FastAPI** performant
- **Frontend React** avec Material-UI
- **Gestion d'erreurs avancée**
- **Auto-scroll intelligent**
- **Copie de code** en un clic

## 🚀 Démarrage rapide

### Prérequis
- Node.js (v16+)
- Python 3.8+
- LM Studio en cours d'exécution

### Installation

1. **Cloner le projet**
```bash
git clone https://github.com/votre-username/veridia.git
cd veridia
```

2. **Backend (FastAPI)**
```bash
cd backend
pip install -r requirements.txt
```

3. **Frontend (React)**
```bash
cd frontend
npm install
```

### Lancement

1. **Démarrer LM Studio** et charger un modèle

2. **Lancer le backend**
```bash
cd backend
uvicorn main:app --reload
```

3. **Lancer le frontend**
```bash
cd frontend
npm start
```

4. **Accéder à l'application**
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000

## 📁 Structure du projet

```
veridia/
├── backend/                 # API FastAPI
│   ├── main.py             # Serveur principal
│   └── requirements.txt    # Dépendances Python
├── frontend/               # Interface React
│   ├── src/
│   │   ├── App_chat.js    # Interface chat principale
│   │   ├── index.css      # Styles globaux Apple
│   │   └── index.js       # Point d'entrée
│   └── package.json       # Dépendances Node.js
├── .github/
│   └── copilot-instructions.md
├── .gitignore
├── .gitattributes
└── README.md
```

## ⚙️ Configuration

### Modèle LM Studio
Modifiez `DEFAULT_MODEL` dans `backend/main.py` selon votre modèle :
```python
DEFAULT_MODEL = "deepseek-coder-v2-lite-instruct"  # À adapter
```

### URL LM Studio
Si LM Studio fonctionne sur un port différent :
```python
LM_STUDIO_API_URL = "http://localhost:1234/v1/chat/completions"
```

## 🎨 Design

### Typographie
- **Principale** : SF Pro Text (Apple)
- **Code** : SF Mono (Apple)
- **Affichage** : SF Pro Display (Apple)

### Couleurs
- **Primaire** : #007AFF (Apple Blue)
- **Secondaire** : #5856D6 (Apple Purple)
- **Background** : Gradient #f5f7fa → #c3cfe2
- **Texte** : #1d1d1f (Apple Black)

## 🔧 Développement

### Commandes utiles

**Backend :**
```bash
# Tests de l'API
curl http://localhost:8000/api/health

# Logs en temps réel
uvicorn main:app --reload --log-level debug
```

**Frontend :**
```bash
# Build de production
npm run build

# Analyse des dépendances
npm audit
```

## 📊 Statistiques

L'application track automatiquement :
- Nombre total de requêtes
- Tokens consommés
- Temps de réponse moyen
- Historique des conversations

## 🤝 Contribution

1. Fork le projet
2. Créer une branche (`git checkout -b feature/nouvelle-fonctionnalite`)
3. Commit (`git commit -am 'Ajout nouvelle fonctionnalité'`)
4. Push (`git push origin feature/nouvelle-fonctionnalite`)
5. Créer une Pull Request

## 📝 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 🙏 Remerciements

- **LM Studio** pour l'infrastructure LLM locale
- **Material-UI** pour les composants React
- **Apple** pour l'inspiration design et typographique
- **FastAPI** pour le framework backend performant

---

**Veridia** - Votre assistant IA personnel pour le développement ✨
