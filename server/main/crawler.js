const cheerio = require('cheerio')
const requestPromise = require('request-promise')
const db = require('./db')

let sitesToVisit = [];
let reachedSecondLevel = false;
let wordFrequency = {};


const crawl = async (link) => {

	sitesToVisit.push(link.href);
	let size = sitesToVisit.length;
	for( let i = 0; i < size ; i++ ){
		let link = sitesToVisit.pop();
		console.log("sitesToVisit Len: " + sitesToVisit.length);
		console.log(link);
		
		//get the index stat time
		const indexStart = new Date().getTime() / 1000;

		try{
			//request site
			const response = await requestPromise({
				uri: link,
				headers: {
					'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Safari/537.36'
				},
				gzip: true
			});
			
			
			let $ = cheerio.load(response);
			
			let title = clean($("title").text());
			let description = clean($('meta[name="description"]').attr('content'));

			
			wordFrequency = countWordFrequency($);

			let indexEnd = new Date().getTime() / 1000;
			let page = {
				title : title,
				description : description,
				url : link,
				timeToIndex : (indexEnd - indexStart)
			}
			
			//insert into db
			//insertPage(page, callback)
			if( title !== "" && description !== "" )
				db.insertPage(page, insertWord);

			if( !reachedSecondLevel ){
				extractAbsoluteLinks($);
			}
		}catch(e){
		 console.log("error");
		}
	}


	console.log("DONE");
	
}

//insert into the word table and the page_word table
const insertWord = (pageId) =>{
	
	let qCheck = `SELECT * FROM word WHERE word_name = $1`;
	let qInsert = `INSERT INTO word (word_name) VALUES ($1) RETURNING *`;
	let q_page_word = `INSERT INTO page_word (page_id, word_id, freq) values ($1, $2, $3) RETURNING *`;
	
	for( let word in wordFrequency ){
		db.pool.query(qCheck, [word], (err, res ) => {
			if( res.rowCount == 1 ){
				let wordId = res.rows[0].word_id;
				let freq = wordFrequency[word];
				if( freq && freq > 0 ){
					db.pool.query(q_page_word, [pageId, wordId, freq]);
				}
			}
			else{
				db.pool.query(qInsert, [word], (err, res) => {
					let wordId = res.rows[0].word_id;
					let freq = wordFrequency[word];
					if( freq && freq > 0 ){
						db.pool.query(q_page_word, [pageId, wordId, freq]);
					}
				})
			}
			
		})
	}
}

//remove whitespace
function clean(words){
	if( !words || words === "" ){
		return "";
	}
	return words.replace(/\s\s+/g,' ').trim();
}


function extractAbsoluteLinks ($){
	let absoluteLinks = $("a[href^='http']");

	absoluteLinks.each( function (){
		let link = $(this).attr('href');
		sitesToVisit.push(link);
	});
	console.log(sitesToVisit.length + ' sites to visite length');
	reachedSecondLevel = true;
}


function countWordFrequency($){
	//get all words
	let words = getAllWords($);

	//hashmap
	let wordFreqMap = {};
	
	//clean words
	let allWords = words
		.replace(/\s\s+/g,' ')
		.replace(/[\n//.,$*>&%?!;:()"_-]/g, ' ')
		.replace(/[0-9]/g, ' ')
		.split(' ');

	//count frequency
	allWords.forEach( function (word) {
		if( word && word !== ""  && word.length > 1){
			let tempWord = word.toLowerCase();
			if( !wordFreqMap[tempWord] ){
				wordFreqMap[tempWord] = 1;
			}
			else{
				wordFreqMap[tempWord] += 1;
			}
		}
	})
	return wordFreqMap;
}

function getAllWords($){
	let h1 = "";
    let h2 = "";
    let h3 = "";
    let h4 = "";
    let h5 = "";
    let h6 = "";
	let p  = "";

	let title = clean($("title").text());
	let description = clean($('meta[name="description"]').attr('content'));
	
    $("h1").each(function () {
        h1 += $(this).text() + " ";
	});
	
    $("h2").each(function () {
        h2 += $(this).text() + " ";
	});
	
    $("h3").each(function () {
        h3 += $(this).text() + " ";
	});
	
    $("p").each(function () {
        p += $(this).text() + " ";
	});
	
    let allwords = h1 + h2 + h3 + h4 + h5 + h6 + p + title + description;
    return allwords;
}


module.exports = {
	crawl,
}


