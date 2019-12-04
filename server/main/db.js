const { Pool } = require('pg');

const pool = new Pool({
  user: 'username',
  host: 'localhost',
  database: 'databasename',
  password: 'password',
  post: 5432
})


  const search = (request, response) => {

      let searchQuery = request.query.searchQuery;
      let q = `select pg.url, pg.title, pg.description,  Count(w.word_name)
      from page_word as pw
      left join page as pg
      on pw.page_id = pg.page_id
      left join word as w
      on pw.word_id = w.word_id
      where w.word_name like $1
      group by pg.url, pg.title, pg.description, pw.freq, w.word_name
      order by pg.url`;

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
        }
      })
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