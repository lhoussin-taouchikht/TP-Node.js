// server.js
const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');
const postManager = require('./postManager');

const PORT = 3000;

// Fonction pour parser le body JSON
function parseJsonBody(request, callback) {
  let body = '';
  request.on('data', chunk => {
    body += chunk.toString();
  });
  request.on('end', () => {
    try {
      const data = body ? JSON.parse(body) : {};
      callback(null, data);
    } catch (error) {
      callback(error, null);
    }
  });
}

// Créer le serveur en testant sur la méthode HTTP et le pathname
const server = http.createServer((request, response) => {
  const parsedUrl = url.parse(request.url, true);
  const pathname = parsedUrl.pathname;
  const method = request.method;

  // Headers CORS pour permettre l'accès depuis le client web
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Gérer la requête preflight CORS
  if (method === 'OPTIONS') {
    response.writeHead(204);
    response.end();
    return;
  }

  // Expression régulière pour extraire l'ID du post : /api/posts/:id
  const postMatch = pathname.match(/^\/api\/posts\/(\d+)$/);

  // Routes API
  // GET /api/posts - Obtenir tous les posts
  if (pathname === '/api/posts' && method === 'GET') {
    response.setHeader('Content-Type', 'application/json');
    postManager.getAllPosts((err, posts) => {
      if (err) {
        response.writeHead(500);
        response.end(JSON.stringify({ error: 'Erreur serveur' }));
      } else {
        response.writeHead(200);
        response.end(JSON.stringify(posts));
      }
    });
  }
  // GET /api/posts/:id - Obtenir un post par ID
  else if (postMatch && method === 'GET') {
    response.setHeader('Content-Type', 'application/json');
    const id = postMatch[1];
    postManager.getPost(id, (err, post) => {
      if (err) {
        response.writeHead(404);
        response.end(JSON.stringify({ error: 'Post non trouvé' }));
      } else {
        response.writeHead(200);
        response.end(JSON.stringify(post));
      }
    });
  }
  // POST /api/posts - Créer un nouveau post
  else if (pathname === '/api/posts' && method === 'POST') {
    response.setHeader('Content-Type', 'application/json');
    parseJsonBody(request, (err, data) => {
      if (err) {
        response.writeHead(400);
        response.end(JSON.stringify({ error: 'Corps JSON invalide' }));
      } else {
        postManager.insertPost(data, (err, newPost) => {
          if (err) {
            response.writeHead(500);
            response.end(JSON.stringify({ error: 'Erreur lors de la création du post' }));
          } else {
            response.writeHead(201);
            response.end(JSON.stringify(newPost));
          }
        });
      }
    });
  }
  // PUT /api/posts/:id - Mettre à jour un post
  else if (postMatch && method === 'PUT') {
    response.setHeader('Content-Type', 'application/json');
    const id = postMatch[1];
    parseJsonBody(request, (err, data) => {
      if (err) {
        response.writeHead(400);
        response.end(JSON.stringify({ error: 'Corps JSON invalide' }));
      } else {
        postManager.updatePost(id, data, (err, updatedPost) => {
          if (err) {
            response.writeHead(404);
            response.end(JSON.stringify({ error: 'Post non trouvé' }));
          } else {
            response.writeHead(200);
            response.end(JSON.stringify(updatedPost));
          }
        });
      }
    });
  }
  // DELETE /api/posts/:id - Supprimer un post
  else if (postMatch && method === 'DELETE') {
    response.setHeader('Content-Type', 'application/json');
    const id = postMatch[1];
    postManager.deletePost(id, (err, deletedPost) => {
      if (err) {
        response.writeHead(404);
        response.end(JSON.stringify({ error: 'Post non trouvé' }));
      } else {
        response.writeHead(200);
        response.end(JSON.stringify({ message: 'Post supprimé avec succès', post: deletedPost }));
      }
    });
  }
  // Servir client/index.html pour faciliter l'accès depuis le navigateur (GET / ou GET /client)
  else if ((pathname === '/' || pathname === '/index.html' || pathname === '/client' || pathname === '/client/index.html') && method === 'GET') {
    const clientPath = path.join(__dirname, 'client', 'index.html');
    fs.readFile(clientPath, 'utf8', (err, html) => {
      if (err) {
        response.setHeader('Content-Type', 'application/json');
        response.writeHead(404);
        response.end(JSON.stringify({ error: 'Fichier client/index.html introuvable' }));
      } else {
        response.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        response.end(html);
      }
    });
  }
  // Route non trouvée
  else {
    response.setHeader('Content-Type', 'application/json');
    response.writeHead(404);
    response.end(JSON.stringify({ error: 'Route non trouvée' }));
  }
});

// Démarrer le serveur
server.listen(PORT, () => {
  console.log(`Serveur API démarré sur http://localhost:${PORT}`);
  console.log('Routes disponibles:');
  console.log('  GET    /api/posts');
  console.log('  GET    /api/posts/:id');
  console.log('  POST   /api/posts');
  console.log('  PUT    /api/posts/:id');
  console.log('  DELETE /api/posts/:id');
});

