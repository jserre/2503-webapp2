# Architecture de l'extension inNotion

Ce document décrit l'architecture et l'organisation du code de l'extension Chrome inNotion qui s'affiche dans le panneau latéral du navigateur.

## Structure du projet

```
├── manifest.json         # Configuration de l'extension
├── background.js         # Service worker pour événements d'arrière-plan
├── sidepanel.html        # Structure minimaliste pour le conteneur
├── sidepanel.js          # Orchestrateur central (très léger)
├── /shared/              # Utilitaires partagés
│   ├── router.js         # Routeur avec chargement CSS dynamique
│   ├── store.js          # Gestion des données
│   ├── utils.js          # Fonctions utilitaires
│   ├── api.js            # Fonctions API
│   └── theme-manager.js  # Gestionnaire de thème (clair/sombre)
├── /styles/              # Styles globaux
│   ├── variables.css     # Variables CSS (couleurs, polices, etc.)
│   ├── main.css          # Importation et organisation des styles
│   ├── typography.css    # Styles typographiques
│   ├── animations.css    # Animations et transitions
│   └── colors.css        # Classes utilitaires de couleurs
└── /pages/               # Chaque page dans son propre dossier
    ├── /home/            # Page d'accueil
    │   ├── home.html     # Structure HTML de la page
    │   ├── home.css      # Styles spécifiques à la page
    │   └── home.js       # Logique JavaScript de la page
    ├── /settings-list/   # Page de liste des paramètres
    │   ├── settings-list.html
    │   ├── settings-list.css
    │   └── settings-list.js
    └── /new-setting/     # Page de création de paramètre
        ├── new-setting.html
        ├── new-setting.css
        └── new-setting.js
```

## Architecture par page

L'extension suit une architecture modulaire où chaque page est autonome et contient ses propres fichiers HTML, CSS et JavaScript.

### Cycle de vie d'une page

1. **Initialisation** : Le fichier `sidepanel.js` importe toutes les pages disponibles
2. **Enregistrement** : Chaque page s'enregistre auprès du routeur dans son fichier JavaScript
3. **Navigation** : Le routeur charge dynamiquement les pages lorsque l'utilisateur navigue
4. **Chargement** : La fonction `initXxxPage()` de chaque page charge le HTML depuis son fichier .html
5. **Stylisation** : Le routeur charge automatiquement le CSS spécifique à la page

### Création d'une nouvelle page

Pour ajouter une nouvelle page à l'extension :

1. Créer un nouveau dossier dans `/pages/` (ex: `/pages/settings/`)
2. Créer trois fichiers dans ce dossier :
   - `settings.html` : Structure HTML de la page
   - `settings.css` : Styles spécifiques à la page
   - `settings.js` : Logique JavaScript avec l'enregistrement auprès du routeur
3. Importer la page dans `sidepanel.js`:
   ```javascript
   // Dans sidepanel.js
   import './pages/settings/settings.js';
   ```

## Organisation des styles CSS

L'extension suit une organisation modulaire des styles CSS pour faciliter la maintenance :

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
2. Status colors - Couleurs de statut spécifiques à Notion
3. Select colors - Couleurs de fond pour les éléments select
4. Badge styles - Style pour les badges de statut et de sélection
5. State indicators - Couleurs pour les états d'erreur et de succès
6. Component-specific colors - Traitements de couleur spécifiques aux composants
7. Empty states - Style pour les états vides ou en chargement
8. User interface colors - Couleurs pour les personnes, fichiers et autres éléments d'interface
9. Hover effects - Transitions de couleur pour les états de survol
10. Animation colors - Effets de couleur pour les animations

### 5. Main CSS (main.css)

Fichier principal qui importe tous les modules CSS et définit les styles de base et de mise en page.

## Flux de données

- Les données utilisateur sont gérées via le module `store.js`
- Les interactions avec l'API Chrome sont encapsulées dans `api.js`
- Le routeur (`router.js`) gère la navigation entre les pages
- Les utilitaires communs sont disponibles dans `utils.js`

## Prochaines étapes de développement

1. Implémenter des pages supplémentaires suivant la même structure
2. Ajouter des fonctionnalités spécifiques à chaque page
3. Améliorer les interactions utilisateur et les animations
4. Développer des fonctionnalités de synchronisation avec Notion
