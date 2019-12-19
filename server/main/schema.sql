CREATE TABLE page (
    page_id SERIAL,
    url TEXT,
    title TEXT,
    description TEXT,
    last_modified TIMESTAMP,
    last_indexed TIMESTAMP,
    time_to_index DOUBLE PRECISION,
   PRIMARY KEY (page_id));

CREATE TABLE word(
	word_id SERIAL,
	word_name text,
	PRIMARY KEY (word_id)
);


CREATE TABLE page_word (
    page_word_Id SERIAL,
    page_id SERIAL,
    word_id SERIAL,
    freq INTEGER NOT NULL,
    PRIMARY KEY (page_word_id),
    FOREIGN KEY (page_id) REFERENCES page (page_id),
    FOREIGN KEY (word_id) REFERENCES word (word_id)
);

CREATE TABLE search(
	search_id SERIAL,
	terms TEXT,
	count INTEGER,
    search_date DATE DEFAULT CURRENT_DATE,
	time_to_search DOUBLE PRECISION,
	PRIMARY KEY (search_id)
);





