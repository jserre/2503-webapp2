# inNotion Web App

Une application web inspirée de Notion avec une interface propre et minimaliste. Construite avec JavaScript et CSS vanilla, optimisée avec Vite et déployable sur Vercel.

## Fonctionnalités

- Design inspiré de Notion avec une interface utilisateur épurée
- Gestion de thème avec support des modes clair/sombre/système
- Architecture modulaire basée sur des pages pour un développement facile
- Routeur simple avec chargement dynamique des CSS
- Stockage local des préférences utilisateur et des données
- Utilitaires pour la manipulation du DOM, la gestion des dates et plus
- Configuration Vite pour un développement rapide et une build optimisée
- Configuration Vercel pour un déploiement simplifié

## Structure du projet

```
├── index.html          # Point d'entrée HTML principal
├── index.js            # Point d'entrée JavaScript principal
├── vite.config.js      # Configuration de Vite (serveur de développement et build)
├── vercel.json         # Configuration de déploiement Vercel
├── package.json        # Configuration du projet et dépendances
├── icon128.png         # Icône de l'application
├── /shared/            # Utilitaires et fonctionnalités partagés
│   ├── router.js       # Routeur simple avec chargement CSS dynamique
│   ├── store.js        # Gestion d'état avec localStorage
│   ├── utils.js        # Fonctions utilitaires (debounce, formatDate, etc.)
│   ├── api.js          # Fonctions API avec mock pour développement
│   └── theme-manager.js # Gestion des thèmes (clair/sombre/système)
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
2. Installez les dépendances avec npm :
   ```bash
   npm install
   ```

### Serveur de développement Vite

Ce projet utilise Vite comme outil de développement et de build. Vite offre un serveur de développement ultra-rapide avec Hot Module Replacement (HMR).

Pour démarrer le serveur de développement :

```bash
npm run dev
```

Le serveur démarrera sur http://localhost:3000 par défaut.

### Build de production

Pour créer une version optimisée pour la production :

```bash
npm run build
```

Les fichiers de production seront générés dans le dossier `dist/`.

Pour prévisualiser la version de production localement :

```bash
npm run preview
```

### Ajout d'une nouvelle page

1. Créez un nouveau dossier dans `/pages` (ex: `/pages/settings/`)
2. Créez les fichiers de la page (ex: `settings.html`, `settings.js` et `settings.css`)
3. Enregistrez la page auprès du routeur dans votre fichier JS :

```javascript
import { registerPage } from '../../shared/router.js';

function initSettingsPage(container, params) {
  // Charger le HTML de la page (avec chemin absolu pour Vite)
  fetch('/pages/settings/settings.html')
    .then(response => response.text())
    .then(html => {
      // Insérer le HTML dans le conteneur
      container.innerHTML = html;
      
      // Initialiser les éléments de la page
      initializePageElements();
    })
    .catch(error => {
      console.error('Error loading settings page:', error);
      container.innerHTML = '<div class="error-message">Failed to load settings page</div>';
    });
}

function initializePageElements() {
  // Code d'initialisation spécifique à la page
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

## Gestion des thèmes

L'application prend en charge trois modes de thème :
- Clair (`light`)
- Sombre (`dark`)
- Système (`system`) - utilise les préférences du système d'exploitation

Le thème est géré par le module `theme-manager.js` qui :
- Détecte les préférences du système
- Sauvegarde les préférences de l'utilisateur dans localStorage
- Applique dynamiquement les classes CSS appropriées

## Variables d'environnement avec Vite

Vite utilise un préfixe `VITE_` pour les variables d'environnement accessibles côté client. Dans ce projet :

1. Créez ou modifiez le fichier `.env` à la racine du projet
2. Préfixez toutes les variables avec `VITE_` :
   ```
   VITE_SUPABASE_URL=votre_url_supabase
   VITE_SUPABASE_ANON=votre_clé_anon
   ```
3. Accédez aux variables dans le code via `import.meta.env.VITE_*` :
   ```javascript
   const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
   ```

Seules les variables préfixées par `VITE_` seront exposées au code client.

## Déploiement sur Vercel

Ce projet est configuré pour être déployé facilement sur Vercel. La configuration se trouve dans le fichier `vercel.json` à la racine du projet.

### Configuration Vercel

Le fichier `vercel.json` contient :
- La version de l'API Vercel
- Le framework utilisé (Vite)
- Les commandes de build et d'installation
- Le répertoire de sortie
- Les règles de routage
- Les variables d'environnement

### Déploiement

Pour déployer sur Vercel :

1. Créez un compte sur [Vercel](https://vercel.com) si vous n'en avez pas déjà un
2. Installez l'interface en ligne de commande Vercel :
   ```bash
   npm i -g vercel
   ```
3. Connectez-vous à votre compte Vercel :
   ```bash
   vercel login
   ```
4. Déployez l'application :
   ```bash
   vercel
   ```

### Variables d'environnement sur Vercel

Les variables d'environnement sont définies dans le fichier `vercel.json` et font référence à des secrets Vercel :

```json
"env": {
  "VITE_SUPABASE_URL": "@supabase_url",
  "VITE_SUPABASE_ANON": "@supabase_anon"
}
```

Pour configurer ces secrets sur Vercel :

```bash
vercel secrets add supabase_url "votre_url_supabase"
vercel secrets add supabase_anon "votre_clé_anon"
```

## Stockage des données

L'application utilise localStorage pour persister les données. Le fichier `store.js` fournit une interface simple pour gérer l'état et sauvegarder dans le stockage local :

```javascript
// Obtenir l'état actuel
const state = getState();

// Mettre à jour l'état (sauvegarde automatiquement dans localStorage)
updateState({ userData: { name: 'Utilisateur' } });

// S'abonner aux changements d'état
const unsubscribe = subscribe(state => {
  console.log('État mis à jour:', state);
});
```
