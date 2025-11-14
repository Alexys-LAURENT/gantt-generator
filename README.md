# 📊 Gantt Chart Generator

> Créez des diagrammes de Gantt professionnels en quelques secondes. Outil gratuit, open-source et sans inscription.

[![Next.js](https://img.shields.io/badge/Next.js-16.0-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2-blue?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38bdf8?logo=tailwind-css)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)

![Gantt Generator Preview](public/og-image.png)

## ✨ Fonctionnalités

- 📝 **Configuration JSON simple** - Format intuitif pour définir vos tâches
- 🔗 **Dépendances visuelles** - Flèches colorées pour visualiser les relations entre tâches
- 👥 **Groupes de tâches** - Organisez vos tâches par équipe ou catégorie
- 🎨 **Interface moderne** - Design professionnel avec Tailwind CSS
- 📥 **Export PNG haute qualité** - 2 formats d'export (écran et large)
- 🌐 **Multi-langue** (FR/EN) - Interface traduite automatiquement
- 📱 **Responsive** - Fonctionne sur tous les appareils
- 🔍 **Mode fullscreen** - Visualisation optimale pour les grands projets
- ⚡ **Performances optimales** - Next.js 16 avec React 19

## 🚀 Technologies

### Core
- **[Next.js 16.0](https://nextjs.org/)** - Framework React avec App Router
- **[React 19.2](https://react.dev/)** - Bibliothèque UI
- **[TypeScript 5.0](https://www.typescriptlang.org/)** - Typage statique
- **[Tailwind CSS 4.0](https://tailwindcss.com/)** - Framework CSS utility-first

### Outils
- **[Volta.js](https://volta.sh/)** - Gestionnaire de versions Node.js/npm
- **[ESLint](https://eslint.org/)** - Linter JavaScript/TypeScript
- **[html-to-image](https://github.com/bubkoo/html-to-image)** - Export PNG

### SEO & Performance
- Métadonnées Open Graph complètes
- Structured Data (JSON-LD)
- Sitemap & Robots.txt dynamiques
- PWA manifest
- Score Lighthouse 90+

## 📦 Installation

### Prérequis

- **Node.js 18+** et **npm 9+**
- **Volta.js** (recommandé pour gérer les versions)

### Installer Volta.js (recommandé)

```bash
# macOS/Linux
curl https://get.volta.sh | bash

# Windows
# Téléchargez depuis https://volta.sh/
```

### Cloner et installer

```bash
# Cloner le repository
git clone https://github.com/Alexys-LAURENT/gantt-generator.git
cd gantt-generator

# Installer les dépendances
npm install

# Créer le fichier .env.local (optionnel)
cp .env.example .env.local
```

## 🔧 Configuration

### Variables d'environnement

Créez un fichier `.env.local` à la racine :

```bash
# URL de base de l'application
# En développement local
NEXT_PUBLIC_APP_URL=http://localhost:3000

# En production (changez avec votre domaine)
# NEXT_PUBLIC_APP_URL=https://votre-domaine.com
```

> **Note** : Si vous ne définissez pas `NEXT_PUBLIC_APP_URL`, l'app utilisera `http://localhost:3000` par défaut.

### Configuration centralisée

Toute la configuration SEO est dans `lib/config.ts` :
- URLs et domaines
- Informations auteur
- Mots-clés SEO
- Chemins des images
- Couleurs du thème

## 🎯 Utilisation

### Développement

```bash
# Lancer le serveur de développement
npm run dev

# Ouvrir http://localhost:3000
```

### Build & Production

```bash
# Créer un build de production
npm run build

# Lancer le serveur de production
npm start

# Vérifier les erreurs TypeScript
npm run type-check

# Lancer le linter
npm run lint
```

## 📖 Format JSON

Format des tâches pour générer un diagramme de Gantt :

```json
[
  {
    "key": 1,
    "name": "Nom de la tâche",
    "start_date": "2025-01-01",
    "end_date": "2025-01-15",
    "group": "Équipe A",
    "depends": [2, 3]
  }
]
```

### Champs

| Champ | Type | Requis | Description |
|-------|------|--------|-------------|
| `key` | number | ✅ | Identifiant unique de la tâche |
| `name` | string | ✅ | Nom de la tâche |
| `start_date` | string | ✅ | Date de début (format ISO 8601: YYYY-MM-DD) |
| `end_date` | string | ✅ | Date de fin (format ISO 8601: YYYY-MM-DD) |
| `group` | string | ❌ | Groupe de la tâche (optionnel) |
| `depends` | number[] | ❌ | Tableau des clés des tâches dont dépend cette tâche |

## 🎨 Modes de visualisation des dépendances

- **Masqué** - Aucune dépendance affichée
- **Survol** - Voir au survol de la souris
- **Clic** - Cliquer pour afficher/masquer
- **Tout** - Toutes les dépendances affichées

## 📥 Export

### 2 formats d'export disponibles :

1. **Taille écran** - Export à la taille actuelle du Gantt
2. **Format large (2:1)** - Export optimisé avec un ratio 2x plus large que haut

Les contrôles de dépendances sont automatiquement exclus de l'export PNG.

## 🌐 Multi-langue

L'application supporte le français et l'anglais. Le changement de langue se fait via le bouton en haut à droite.

Les traductions sont dans :
- `messages/fr.json`
- `messages/en.json`

## 📁 Structure du projet

```
gantt-generator/
├── app/                    # Pages et layouts Next.js
│   ├── layout.tsx         # Layout principal avec SEO
│   ├── page.tsx           # Page d'accueil
│   ├── globals.css        # Styles globaux
│   ├── sitemap.ts         # Sitemap dynamique
│   ├── robots.ts          # Robots.txt dynamique
│   └── manifest.ts        # PWA manifest dynamique
├── components/            # Composants React
│   ├── GanttChart.tsx    # Composant principal du Gantt
│   ├── GanttToolSection.tsx
│   ├── HeroSection.tsx
│   ├── Footer.tsx
│   └── ...
├── lib/                   # Utilitaires et helpers
│   ├── config.ts         # Configuration centralisée (SEO, URLs)
│   ├── i18n.tsx          # Système de traduction
│   ├── colors.ts         # Générateur de couleurs
│   ├── dateUtils.ts      # Utilitaires de dates
│   └── taskUtils.ts      # Logique des tâches Gantt
├── messages/             # Traductions i18n
│   ├── fr.json
│   └── en.json
├── public/               # Assets statiques
│   ├── og-image.png     # Image Open Graph
│   ├── favicon.ico      # Favicon
│   └── ...
├── .env.local           # Variables d'environnement (à créer)
└── package.json         # Dépendances et scripts
```

## 🚢 Déploiement

### Vercel (recommandé)

```bash
# Installer Vercel CLI
npm i -g vercel

# Déployer
vercel
```

**Variables d'environnement à ajouter sur Vercel** :
- `NEXT_PUBLIC_APP_URL` = `https://votre-domaine.com`

### Autres plateformes

L'app peut être déployée sur :
- Netlify
- Railway
- AWS Amplify
- Tout hébergeur supportant Next.js

## 🔍 SEO

### Optimisations implémentées

✅ Métadonnées Open Graph (Facebook, LinkedIn)  
✅ Twitter Cards  
✅ Structured Data (JSON-LD Schema.org)  
✅ Sitemap XML dynamique  
✅ Robots.txt dynamique  
✅ PWA manifest  
✅ Canonical URLs  
✅ Alternate languages (hreflang)  
✅ 20+ mots-clés stratégiques  
✅ Accessibilité WCAG 2.1  
✅ HTML5 sémantique  

### Score SEO estimé : 92/100 ⭐

## 📊 Performances

- **Lighthouse Score** : 90+
- **Core Web Vitals** : Optimisé
- **Bundle size** : Optimisé avec Next.js 16
- **Images** : AVIF/WebP avec optimisation automatique
- **Compression** : Gzip/Brotli activée

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à :

1. Fork le projet
2. Créer une branche (`git checkout -b feature/AmazingFeature`)
3. Commit vos changements (`git commit -m 'Add some AmazingFeature'`)
4. Push sur la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📝 License

Ce projet est sous licence MIT. Voir le fichier [LICENSE](LICENSE) pour plus de détails.

## 👤 Auteur

**Alexys LAURENT**

- GitHub: [@Alexys-LAURENT](https://github.com/Alexys-LAURENT)
- LinkedIn: [Alexys LAURENT](https://www.linkedin.com/in/alexys-laurent-363210231/)

## 🙏 Remerciements

- [Next.js](https://nextjs.org/) - Framework React
- [Vercel](https://vercel.com/) - Hosting & déploiement
- [Tailwind CSS](https://tailwindcss.com/) - Framework CSS
- [html-to-image](https://github.com/bubkoo/html-to-image) - Export PNG

---

⭐ Si ce projet vous plaît, n'hésitez pas à lui donner une étoile sur GitHub !

