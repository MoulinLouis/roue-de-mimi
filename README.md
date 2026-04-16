# La Roue de Mimi

Une roue aléatoire féerique pour choisir le prochain coloriage, thème Gardevoir + Nymphali.

## Dev

```bash
npm install
npm run dev
```

## Build

```bash
npm run build      # produit dist/
npm run preview    # sert dist/ en local
```

## Déploiement Vercel

Vercel détecte Vite automatiquement :

1. Pousser le repo sur GitHub/GitLab
2. Importer dans Vercel → aucune config requise
3. `Build Command: npm run build`, `Output Directory: dist` (auto-rempli)

## Stack

- Vite + React 18 + TypeScript
- Tailwind CSS (palette fée custom)
- Framer Motion (animations, modal, confettis)
- Canvas HTML5 pour la roue

La liste des tomes est persistée dans `localStorage` (`roue-de-mimi:tomes:v1`).
