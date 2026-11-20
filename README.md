# TP : Initiation à Node.js - Création d'une API REST

Ce projet implémente une API REST complète en Node.js sans framework externe, en utilisant les modules natifs (`http`, `https`, `fs`, `url`, `path`).

## Structure du projet

```
tp-nodejs-api/
├── seed.js             # Script pour récupérer les données depuis JSONPlaceholder
├── posts.json          # Base de données locale au format JSON (générée par seed.js)
├── postManager.js      # Module CRUD pour la gestion des posts
├── server.js           # Serveur HTTP exposant l'API REST
├── api-tests.http      # Fichier de requêtes pour l'extension REST Client VS Code
├── client/
│   └── index.html      # Interface web complète consommant l'API REST
└── package.json        # Configuration du projet
```

## Instructions d'exécution

### 1. Initialiser les données (seed)
Exécutez le script pour récupérer les 100 posts depuis `https://jsonplaceholder.typicode.com/posts` et créer le fichier `posts.json` :
```bash
node seed.js
```

### 2. Démarrer le serveur API
```bash
node server.js
```
Le serveur sera disponible sur [http://localhost:3000](http://localhost:3000).

### 3. Routes de l'API REST
- **GET** `/api/posts` : Obtenir tous les posts
- **GET** `/api/posts/:id` : Obtenir un post par son identifiant
- **POST** `/api/posts` : Créer un nouveau post (corps JSON : `{ "userId": 1, "title": "...", "body": "..." }`)
- **PUT** `/api/posts/:id` : Mettre à jour un post existant
- **DELETE** `/api/posts/:id` : Supprimer un post

### 4. Tester avec l'extension REST Client
Ouvrez le fichier `api-tests.http` dans VS Code et cliquez sur **Send Request** au-dessus de chaque requête.

### 5. Utiliser l'interface Web Client
- Accédez directement à l'interface dans votre navigateur à l'adresse : [http://localhost:3000](http://localhost:3000) ou ouvrez le fichier `client/index.html`.
- L'interface permet de :
  - Consulter la liste de tous les posts
  - Rechercher / filtrer les posts
  - Créer un nouveau post
  - Modifier un post existant
  - Supprimer un post

