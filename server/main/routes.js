const express = require('express')
const router = express.Router()
const crawler = require('./crawler')
const db = require('./db')

router.post('/api/post/crawl', (req, res, next) => {
    let link = new URL(req.body.name);
    crawler.crawl(link);
})

router.get('/api/search', db.search);

module.exports = router