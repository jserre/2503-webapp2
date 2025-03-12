# inNotion Web App

Une application web inspirée de Notion avec une interface propre et minimaliste. Construite avec JavaScript et CSS vanilla.

## Fonctionnalités

- Design inspiré de Notion avec une interface utilisateur épurée
- Gestion de thème avec support des modes clair/sombre/système
- Architecture basée sur des pages pour un développement facile
- Stockage local des préférences utilisateur

## Structure du projet

```
├── index.html          # Point d'entrée HTML principal
├── index.js            # Point d'entrée JavaScript principal
├── /shared/            # Utilitaires et fonctionnalités partagés
│   ├── router.js       # Routeur simple basé sur les pages
│   ├── store.js        # Gestion d'état avec localStorage
│   ├── utils.js        # Fonctions utilitaires
│   ├── api.js          # Fonctions API
│   └── theme-manager.js # Gestion des thèmes (clair/sombre)
├── /styles/            # Styles globaux
│   ├── variables.css   # Variables CSS et thème
│   ├── main.css        # Styles globaux
│   ├── typography.css  # Styles typographiques
│   ├── colors.css      # Utilitaires de couleur
│   └── animations.css  # Utilitaires d'animation
└── /pages/             # Pages individuelles
    └── /home/          # Page d'accueil
        ├── home.html   # HTML de la page d'accueil
        ├── home.js     # Logique de la page d'accueil
        └── home.css    # Styles de la page d'accueil
```

## Développement

### Installation

1. Clonez ce dépôt
2. Ouvrez le fichier `index.html` dans votre navigateur ou utilisez un serveur local

### Serveur de développement local

Vous pouvez utiliser n'importe quel serveur local simple pour développer cette application. Par exemple :

- Avec Python : `python -m http.server`
- Avec Node.js : `npx serve`

### Ajout d'une nouvelle page

1. Créez un nouveau dossier dans `/pages` (ex: `/pages/settings/`)
2. Créez les fichiers de la page (ex: `settings.html`, `settings.js` et `settings.css`)
3. Enregistrez la page auprès du routeur dans votre fichier JS :

```javascript
import { registerPage } from '../../shared/router.js';

function initSettingsPage(container, params) {
  // Code d'initialisation de la page
}

// Enregistrement de la page
registerPage('settings', initSettingsPage);

export default initSettingsPage;
```

4. Importez la page dans `index.js` :

```javascript
// Dans index.js
import './pages/settings/settings.js';
```

5. Naviguez vers la page en utilisant :

```javascript
import { navigateTo } from '../../shared/router.js';

// Navigation vers la page des paramètres
navigateTo('settings');
```

## Stockage des données

L'application utilise localStorage pour persister les données. Le fichier `store.js` fournit une interface simple pour gérer l'état et sauvegarder dans le stockage local.
