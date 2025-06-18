CREATE TABLE document_metadata (
    id TEXT PRIMARY KEY,
    title TEXT,
    url TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    schema TEXT
);