// postManager.js
const fs = require('fs');
const path = require('path');

const POSTS_FILE = path.join(__dirname, 'posts.json');

// Lire tous les posts
function getAllPosts(callback) {
  fs.readFile(POSTS_FILE, 'utf8', (err, data) => {
    if (err) {
      return callback(err, null);
    }
    try {
      const posts = JSON.parse(data);
      callback(null, posts);
    } catch (parseError) {
      callback(parseError, null);
    }
  });
}

// Obtenir un post par ID
function getPost(id, callback) {
  getAllPosts((err, posts) => {
    if (err) {
      return callback(err, null);
    }
    const numericId = parseInt(id, 10);
    const post = posts.find((p) => p.id === numericId);
    if (!post) {
      return callback(new Error('Post non trouvé'), null);
    }
    callback(null, post);
  });
}

// Insérer un nouveau post
function insertPost(newPost, callback) {
  getAllPosts((err, posts) => {
    if (err) {
      return callback(err, null);
    }
    // Génération automatique d'un nouvel ID (max id + 1)
    const newId = posts.length > 0 ? Math.max(...posts.map((p) => Number(p.id) || 0)) + 1 : 1;
    const postToInsert = {
      id: newId,
      userId: Number(newPost.userId) || 1,
      title: newPost.title || '',
      body: newPost.body || ''
    };

    posts.push(postToInsert);

    savePosts(posts, (saveErr) => {
      if (saveErr) {
        return callback(saveErr, null);
      }
      callback(null, postToInsert);
    });
  });
}

// Mettre à jour un post
function updatePost(id, updatedPost, callback) {
  getAllPosts((err, posts) => {
    if (err) {
      return callback(err, null);
    }
    const numericId = parseInt(id, 10);
    const index = posts.findIndex((p) => p.id === numericId);
    if (index === -1) {
      return callback(new Error('Post non trouvé'), null);
    }

    // Mise à jour en préservant l'ID
    posts[index] = {
      ...posts[index],
      ...updatedPost,
      id: numericId,
      userId: updatedPost.userId !== undefined ? Number(updatedPost.userId) : posts[index].userId
    };

    savePosts(posts, (saveErr) => {
      if (saveErr) {
        return callback(saveErr, null);
      }
      callback(null, posts[index]);
    });
  });
}

// Supprimer un post
function deletePost(id, callback) {
  getAllPosts((err, posts) => {
    if (err) {
      return callback(err, null);
    }
    const numericId = parseInt(id, 10);
    const index = posts.findIndex((p) => p.id === numericId);
    if (index === -1) {
      return callback(new Error('Post non trouvé'), null);
    }

    const [deletedPost] = posts.splice(index, 1);

    savePosts(posts, (saveErr) => {
      if (saveErr) {
        return callback(saveErr, null);
      }
      callback(null, deletedPost);
    });
  });
}

// Fonction utilitaire pour sauvegarder les posts
function savePosts(posts, callback) {
  fs.writeFile(POSTS_FILE, JSON.stringify(posts, null, 2), 'utf8', (err) => {
    if (err) {
      return callback(err);
    }
    callback(null);
  });
}

// Exporter les fonctions
module.exports = {
  getAllPosts,
  getPost,
  insertPost,
  updatePost,
  deletePost
};

