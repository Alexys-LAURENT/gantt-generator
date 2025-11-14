/**
 * Configuration centralisée de l'application
 * Toutes les URLs et constantes SEO sont ici
 */

// URL de base de l'application (depuis la variable d'environnement)
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

// Informations sur l'auteur
export const AUTHOR = {
  name: 'Alexys LAURENT',
  github: 'https://github.com/Alexys-LAURENT',
  linkedin: 'https://www.linkedin.com/in/alexys-laurent-363210231/',
  twitter: '@alexys_laurent',
};

// Métadonnées SEO par défaut
export const SEO = {
  title: {
    default: 'Gantt Chart Generator | Free Professional Project Management Tool',
    template: '%s | Gantt Generator',
  },
  description:
    'Create professional Gantt charts in seconds. Free online tool for project management with task dependencies, visual groups, and high-quality PNG export. No signup required.',
  keywords: [
    'gantt chart',
    'gantt diagram',
    'project management',
    'task planning',
    'timeline generator',
    'project timeline',
    'task dependencies',
    'free gantt chart',
    'online gantt chart',
    'project planner',
    'gantt chart maker',
    'visual project management',
    'task scheduler',
    'project scheduling',
    'team planning',
    'workflow visualization',
    'JSON gantt chart',
    'gantt export',
    'diagramme de gantt',
    'gestion de projet',
  ],
};

// URLs des images (relatives au domaine)
export const IMAGES = {
  ogImage: '/og-image.png',
  favicon: '/favicon.ico',
  faviconSvg: '/favicon.svg',
  favicon96: '/favicon-96x96.png',
  appleTouchIcon: '/apple-touch-icon.png',
  manifest192: '/web-app-manifest-192x192.png',
  manifest512: '/web-app-manifest-512x512.png',
};

// Couleur du thème
export const THEME_COLOR = '#2563eb';

// Nom de l'application
export const APP_NAME = 'Gantt Generator';
export const APP_SHORT_NAME = 'Gantt Gen';
