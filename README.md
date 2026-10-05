# GDPS Demon List

Site statique de Demon List pour un GDPS, inspiré visuellement et fonctionnellement du concept de GDOpenList.

## Fichiers

- `index.html` : site public
- `staff.html` : panneau staff de démonstration
- `assets/data.js` : nom du GDPS, staff et niveaux à modifier
- `assets/app.js` : fonctionnement du site
- `assets/style.css` : design responsive

## Personnalisation

Ouvre `assets/data.js` et remplace :
- `name` par le nom de ton GDPS
- `discord` par l'invitation de ton serveur
- `team` par les vrais membres du staff
- `levels` par tes niveaux, IDs, créateurs, vidéos et records

Chaque niveau contient notamment : `rank`, `category`, `name`, `creator`, `verifier`, `difficulty`, `id`, `description`, `video` et `records`.

## Mise en ligne

Tu peux héberger ce dossier sur GitHub Pages, Cloudflare Pages, Netlify ou un autre hébergeur de sites statiques.

## Important pour les records

La page de soumission fournie ici est une démo front-end : les demandes sont enregistrées dans le `localStorage` du navigateur. Pour un système réellement partagé entre tous les joueurs avec validation staff, il faut connecter le site à un backend/base de données et une authentification staff.

## Licence / attribution

Le projet dont cette réalisation reprend l'idée générale est **GDOpenList** par Electro/Cyns/Prometheus, publié sous licence MIT. Voir `LICENSE` pour l'avis de licence conservé avec ce package.
