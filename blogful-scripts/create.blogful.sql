CREATE TABLE blogful_articles (
    id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY, 
    title TEXT NOT NULL, 
    date_published TIMESTAMPTZ DEFAULT now() NOT NULL, 
    content TEXT
);