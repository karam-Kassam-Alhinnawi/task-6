const express = require('express');
const fs = require('fs');
const app = express();
app.use(express.json());


function getPosts(callback) {
  fs.readFile("data.json", "utf8", (err, data) => {
      const posts = JSON.parse(data);
      callback(posts);
  });
}

function savePosts(data, callback) {
  fs.writeFile("data.json", JSON.stringify(data, null, 2), "utf8", (err) => {
    callback(err)
  });
}

// Get all posts

app.get('/posts', (req, res) => {
  getPosts((posts) => {
    res.json(posts);
  });
});

// Create a new post

app.post('/posts', (req, res) => {
  getPosts((posts) => {
    
    const newPost = {
      id: posts.length + 1,
      title: req.body.title,
      
      description: req.body.description,
    };

    posts.push(newPost);

    savePosts(posts, () => {
      res.status(201).json(newPost);
    });

  });
});

// Update a post

app.put('/posts/:id', (req, res) => {
  getPosts((posts) => {
    const postId = Number(req.params.id);
    const postIndex = posts.findIndex((post) => post.id === postId);

    if (postIndex !== -1) {
      posts[postIndex] = {
        ...posts[postIndex],
        title: req.body.title || posts[postIndex].title,
        description: req.body.description || posts[postIndex].description,
      };

      savePosts(posts, () => {
        res.json(posts[postIndex]);
      });
    }

  });
});

// Delete a post

app.delete('/posts/:id', (req, res) => {
  getPosts((posts) => {

    const postId = Number(req.params.id);
    const updatedPosts = posts.filter((p) => p.id !== postId);

    if (posts.length !== updatedPosts.length) {
      savePosts(updatedPosts, () => {
        res.json({ message: 'Post deleted' });

      });
      
    }

  });
});

app.listen(3000);