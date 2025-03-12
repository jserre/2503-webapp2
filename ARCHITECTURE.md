# Architecture de l'application inNotion Web App

Ce document décrit l'architecture et l'organisation du code de l'application web inNotion, une application inspirée de Notion avec une interface propre et minimaliste.

## Structure du projet

```
├── index.html           # Point d'entrée HTML principal
├── index.js             # Point d'entrée JavaScript principal
├── /shared/             # Utilitaires partagés
│   ├── router.js        # Routeur avec chargement CSS dynamique
│   ├── store.js         # Gestion des données avec localStorage
│   ├── utils.js         # Fonctions utilitaires
│   ├── api.js           # Fonctions API
│   └── theme-manager.js # Gestionnaire de thème (clair/sombre/système)
├── /styles/             # Styles globaux
│   ├── variables.css    # Variables CSS (couleurs, polices, etc.)
│   ├── main.css         # Importation et organisation des styles
│   ├── typography.css   # Styles typographiques
│   ├── animations.css   # Animations et transitions
│   └── colors.css       # Classes utilitaires de couleurs
└── /pages/              # Chaque page dans son propre dossier
    └── /home/           # Page d'accueil
        ├── home.html    # Structure HTML de la page
        ├── home.css     # Styles spécifiques à la page
        └── home.js      # Logique JavaScript de la page
```

## Architecture par page

L'application suit une architecture modulaire où chaque page est autonome et contient ses propres fichiers HTML, CSS et JavaScript.

### Cycle de vie d'une page

1. **Initialisation** : Le fichier `index.js` importe toutes les pages disponibles
2. **Enregistrement** : Chaque page s'enregistre auprès du routeur dans son fichier JavaScript
3. **Navigation** : Le routeur charge dynamiquement les pages lorsque l'utilisateur navigue
4. **Chargement** : La fonction `initXxxPage()` de chaque page charge le HTML depuis son fichier .html
5. **Stylisation** : Le routeur charge automatiquement le CSS spécifique à la page

### Création d'une nouvelle page

Pour ajouter une nouvelle page à l'application :

1. Créer un nouveau dossier dans `/pages/` (ex: `/pages/settings/`)
2. Créer trois fichiers dans ce dossier :
   - `settings.html` : Structure HTML de la page
   - `settings.css` : Styles spécifiques à la page
   - `settings.js` : Logique JavaScript avec l'enregistrement auprès du routeur
3. Importer la page dans `index.js`:
   ```javascript
   // Dans index.js
   import './pages/settings/settings.js';
   ```

## Organisation des styles CSS

L'application suit une organisation modulaire des styles CSS pour faciliter la maintenance :

### 1. Variables CSS (variables.css)

Contient toutes les variables CSS globales, notamment :
- Palette de couleurs
- Typographie
- Espacement
- Ombres et élévation
- Rayons de bordure
- Animations
- Mise en page

### 2. Styles de typographie (typography.css)

Organisé en sections logiques :
- Base typography - Styles de texte de base
- Headings - Titres h1 et en-têtes de section
- Page title - Styles de titre et de champ de saisie
- Form elements - Typographie des inputs, select, textarea
- Property styles - Étiquettes, tags, badges
- Status indicators - États vides, erreurs, chargement
- Special components - Listes déroulantes, éléments de relation, affichages de fichiers
- User interface elements - Noms d'utilisateur, noms de fichiers

### 3. Animations (animations.css)

Organisé en quatre sections principales :
1. Keyframe Animations - Définitions d'animations
2. Animation Utility Classes - Classes utilitaires pour appliquer des animations
3. Transition Utilities - Transitions standard et spécifiques aux composants
4. Transform Utilities - Utilitaires de transformation et de centrage

### 4. Couleurs (colors.css)

Regroupe toutes les classes liées aux couleurs :
1. Status colors - Couleurs de statut spécifiques à Notion
2. Select colors - Couleurs de fond pour les éléments select
3. Badge styles - Style pour les badges de statut et de sélection
4. State indicators - Couleurs pour les états d'erreur et de succès
5. Component-specific colors - Traitements de couleur spécifiques aux composants
6. Empty states - Style pour les états vides ou en chargement
7. User interface colors - Couleurs pour les personnes, fichiers et autres éléments d'interface
8. Hover effects - Transitions de couleur pour les états de survol
9. Animation colors - Effets de couleur pour les animations

### 5. Main CSS (main.css)

Fichier principal qui importe tous les modules CSS et définit les styles de base et de mise en page.

## Flux de données

### Store (store.js)

Le module `store.js` fournit une gestion d'état centralisée avec persistance dans localStorage :

- `initStore()` - Initialise le store avec les données de localStorage
- `getState(key)` - Récupère l'état actuel ou une partie spécifique
- `updateState(newState)` - Met à jour l'état et sauvegarde dans localStorage
- `subscribe(callback)` - S'abonne aux changements d'état

### API (api.js)

Le module `api.js` encapsule les interactions avec les API externes :

- Utilise un système de mock pour le développement sans API externe
- Fournit une interface cohérente pour les requêtes API
- Gère les erreurs et les réponses

### Router (router.js)

Le routeur gère la navigation entre les pages :

- `initRouter()` - Initialise le routeur
- `registerPage(pageName, loadFunction)` - Enregistre une page
- `navigateTo(pageName, params)` - Navigue vers une page spécifique
- Charge automatiquement les CSS spécifiques à chaque page

### Theme Manager (theme-manager.js)

Le gestionnaire de thème gère les préférences de thème :

- Supporte les modes clair, sombre et système
- Détecte les préférences du système
- Persiste les préférences utilisateur
- Applique dynamiquement les classes CSS appropriées

### Utils (utils.js)

Fournit des utilitaires communs :

- `debounce()` - Limite la fréquence d'exécution d'une fonction
- `formatDate()` - Formate les dates de manière conviviale
- `generateId()` - Génère des identifiants uniques
- `safeJsonParse()` - Parse du JSON avec gestion des erreurs
- `createElement()` - Crée des éléments DOM avec attributs et enfants

## Prochaines étapes de développement

1. Implémenter des pages supplémentaires suivant la même structure
2. Ajouter des fonctionnalités de gestion de contenu
3. Améliorer les interactions utilisateur et les animations
4. Intégrer avec des API externes pour la synchronisation des données
5. Ajouter des fonctionnalités de collaboration en temps réel
6. Développer des composants réutilisables pour l'interface utilisateur
