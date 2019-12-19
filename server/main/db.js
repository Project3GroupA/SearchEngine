const { Pool } = require('pg');
const dotenv = require('dotenv');
dotenv.config();

const pool = new Pool({
  user: 'ezihmesjrmyrom',
  host: 'ec2-54-235-248-185.compute-1.amazonaws.com',
  database: 'dc2b7ulp2oqva3',
  password: '99dbaa61cfb30224c62ddb235b961eb88165352c1b95b93cc8ce33fe10c6644b',
  post: 5432
})




const search = (request, response) => {

  let searchQuery = request.query.searchQuery;
  let rawSeachQuery = searchQuery;
  searchQuery = parseSearchKey(searchQuery);
  
  let q = `SELECT pg.url, pg.title, pg.description,  COUNT(w.word_name), SUM(pw.freq) as frequency
          FROM page_word AS pw
          LEFT JOIN page AS pg
          ON pw.page_id = pg.page_id
          LEFT JOIN word AS w
          ON pw.word_id = w.word_id
          WHERE w.word_name SIMILAR TO LOWER($1)
          GROUP BY pg.url, pg.title, pg.description
          ORDER BY frequency DESC
          LIMIT 50`;

  let searchStart = new Date().getTime() / 1000;
  pool.query(q, [searchQuery], (err, res) => {
    if( res ){
     let items = [];
      for( let i = 0; i < res.rows.length; i++ ){
        let item = {
          title   : res.rows[i].title,
          link    : res.rows[i].url,
          snippet : res.rows[i].description,
        }
        items.push(item);
      }
      let jsonObj = JSON.stringify(items);
      response.json(`{"items":${jsonObj}}`);
      
      
      let searchEnd = new Date().getTime() / 1000;
      let numOfResults = res.rowCount;
      let searchTime = searchEnd-searchStart;

      let searchInsert = `INSERT INTO search (terms, count, time_to_search) values($1, $2, $3)`;
      pool.query(searchInsert, [rawSeachQuery, numOfResults, searchTime], (err, res) =>{
        if( err ){
          console.log(err);
        }
      });

    }
    else{
      console.log(err);
      
    }
  })
}

  function parseSearchKey(searchKey){

    if( !searchKey ){
      return '';
    }
    let formattedKey = "";
    let searchKeySplit = searchKey.split(' ');
    let i = 0;
    for( ; i < searchKeySplit.length-1; i++ ){
      formattedKey += '%'+searchKeySplit[i]+'%|';
    }
    return formattedKey += '%'+searchKeySplit[i]+'%';
  }




  const insertPage = (page, callback) => {
    let values = [
      page.title,
      page.description,
      page.url,
      page.timeToIndex
    ]
      let insertQ = `INSERT INTO page(title, description, url, time_to_index, last_modified, last_indexed)
                VALUES ($1, $2, $3, $4, NOW(), NOW())
                RETURNING *`;
      let selectQ = `SELECT * FROM page WHERE url = $1`;

      pool.query( selectQ, [page.url], (err, res) => {

        //check if link already is in db, already indexed if it is
        if( res.rowCount == 0 ){
            //insert and get id
          pool.query(insertQ, values, (q_err, q_res) => {
            //console.log(q_res);
            callback(q_res.rows[0].page_id);
          })
        }
      });


      
  }



module.exports = {
    pool,
    insertPage,
    search,
}