const express = require('express')
const router = express.Router()
const crawler = require('./crawler')
const db = require('./db')

router.post('/api/post/crawl', (req, res, next) => {
    let link = new URL(req.body.name);
    crawler.crawl(link);
})

router.get('/api/search', db.search);

router.get('/api/search/listurl' ,(req,ress)=>{
    db.pool.query('SELECT page_id,url,time_to_index FROM page',(err,res) =>{
        if (err) {
            console.log(err.stack)
        } else {
            //let list = JSON.stringify(res.rows);
            ress.status(200).json(res.rows);
        }
    })

})
router.get('/api/search/terms' ,(req,ress)=>{
    db.pool.query('SELECT word.word_name, page_word.freq FROM word INNER JOIN page_word ON word.word_id=page_word.page_word_id',(err,res) =>{
        if (err) {
            console.log(err.stack)
        } else {
            //let list = JSON.stringify(res.rows);
            ress.status(200).json(res.rows);
        }
    })

})




module.exports = router