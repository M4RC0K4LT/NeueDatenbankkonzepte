const express = require('express');
const router = express.Router();

const posts = require('../database/posts');


/** POST: Post tweet */
router.post('/create', async function(request, response) {
    try {
        const post = await posts.create(request.body);
        let data = Object.assign({"request": "successful"}, post);
        response.status(200).send(data);
    } catch (err) {
        let data = Object.assign({"request": "failed"}, err);
        response.status(500).send(data);
    }
});

module.exports = router;