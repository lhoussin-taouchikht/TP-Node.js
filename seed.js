// seed.js
const https = require('https');
const fs = require('fs');
const path = require('path');

// URL de l'API
const API_URL = 'https://jsonplaceholder.typicode.com/posts';
const POSTS_FILE = path.join(__dirname, 'posts.json');

// Fonction pour récupérer les posts
function fetchPosts() {
  console.log(`Récupération des données depuis ${API_URL}...`);
  https.get(API_URL, (res) => {
    let rawData = '';

    // Réception des morceaux de données
    res.on('data', (chunk) => {
      rawData += chunk;
    });

    // Fin de la réception
    res.on('end', () => {
      try {
        const posts = JSON.parse(rawData);
        console.log(`${posts.length} posts reçus avec succès.`);
        savePosts(posts);
      } catch (error) {
        console.error('Erreur lors du parsing JSON :', error.message);
      }
    });
  }).on('error', (err) => {
    console.error('Erreur lors de la requête HTTPS :', err.message);
  });
}

// Fonction pour sauvegarder les posts
function savePosts(posts) {
  fs.writeFile(POSTS_FILE, JSON.stringify(posts, null, 2), 'utf8', (err) => {
    if (err) {
      console.error('Erreur lors de la sauvegarde dans le fichier :', err.message);
      return;
    }
    console.log(`Fichier posts.json créé avec succès (${posts.length} posts).`);
  });
}

// Exécution du script
fetchPosts();

