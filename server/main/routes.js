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
    db.pool.query('SELECT page_id,url,time_to_index FROM page order by page_id desc LIMIT 5',(err,res) =>{
        if (err) {
            console.log(err.stack)
        } else {
            //let list = JSON.stringify(res.rows);
            ress.status(200).json(res.rows);
        }
    })
    

})
router.get('/api/search/terms' ,(req,ress)=>{
    db.pool.query(`SELECT terms,count,search_date,time_to_search 
                    FROM search 
                    WHERE count > 0
                    ORDER BY search_id desc 
                    LIMIT 5`,
        (err,res) =>{
        if (err) {
            console.log(err.stack)
        } else {
            //let list = JSON.stringify(res.rows);
            ress.status(200).json(res.rows);
        }
    })

})
router.get('/api/search/total' ,(req,ress)=>{
    db.pool.query(`SELECT 
	(SELECT COUNT(page_id) FROM PAGE) as Websites,
	(SELECT COUNT(word_id) FROM PAGE_WORD) as UniqueWords,
	(SELECT SUM(time_to_index) FROM PAGE) as IndexTime,
	(SELECT COUNT(terms) FROM SEARCH) as SearchQuery`,(err,res) =>{
        if (err) {
            console.log(err.stack)
        } else {
            //let list = JSON.stringify(res.rows);
            ress.status(200).json(res.rows);
        }
    })

})




module.exports = router