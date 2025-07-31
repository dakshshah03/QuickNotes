-- add pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- user info table
CREATE TABLE IF NOT EXISTS users (
    user_id UUID PRIMARY KEY,
    email VARCHAR(100) UNIQUE NOT NULL,
    -- username VARCHAR(32) UNIQUE NOT NULL,
    name VARCHAR(50) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    creation_time TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- notebook table
CREATE TABLE IF NOT EXISTS notebooks (
    notebook_id UUID PRIMARY KEY,
    notebook_owner UUID NOT NULL,
    notebook_name VARCHAR(255) NOT NULL,
    pdf_storage_dir VARCHAR(255) NOT NULL,
    creation_time TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_time TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- chat (every notebook can have multiple)
CREATE TABLE IF NOT EXISTS chats (
    chat_id UUID PRIMARY KEY,
    parent_notebook UUID NOT NULL,
    chat_name VARCHAR(30) NOT NULL,
)

-- document table (list of pdfs, file locations, )
CREATE TABLE IF NOT EXISTS documents (
    document_id UUID PRIMARY KEY,
    parent_notebook UUID NOT NULL,
    document_name VARCHAR(255) NOT NULL,
    document_active BOOLEAN NOT NULL,
    creation_time TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- vector tables:
-- document chunks
CREATE TABLE IF NOT EXISTS document_embeddings (
    id UUID PRIMARY KEY, 
    content TEXT,
    metadata JSONB,
    embedding VECTOR(384) -- 384 is for <all-MiniLM-L6-v2> model
)

-- chat history
CREATE TABLE IF NOT EXISTS chat_embeddings (
    id UUID PRIMARY KEY, 
    content TEXT,
    metadata JSONB,
    embedding VECTOR(384)
)

-- connects notebooks to user table
ALTER TABLE notebooks
ADD CONSTRAINT FK_notebook_owner
FOREIGN KEY (notebook_owner) REFERENCES users(user_id)
ON DELETE CASCADE;

-- connects chats to notebook table
ALTER TABLE chats
ADD CONSTRAINT FK_parent_notebook
FOREIGN KEY (parent_notebook) REFERENCES notebooks(notebook_id)
ON DELETE CASCADE;

-- connects documents to notebook table
ALTER TABLE documents
ADD CONSTRAINT FK_parent_notebook
FOREIGN KEY (parent_notebook) REFERENCES notebooks(notebook_id)
ON DELETE CASCADE;


-- index for notebook owner lookups
CREATE INDEX IF NOT EXISTS idx_notebook_owner ON notebooks (notebook_owner);
-- index for lookups to parent notebook for a given document
CREATE INDEX IF NOT EXISTS idx_parent_notebook ON chats (parent_notebook);
CREATE INDEX IF NOT EXISTS idx_parent_notebook ON documents (parent_notebook);

CREATE INDEX IF NOT EXISTS document_embeddings_hnsw_idx ON document_embeddings USING HNSW (embedding vector_cosine_ops);

CREATE INDEX IF NOT EXISTS chat_embeddings_hnsw_idx ON chat_embeddings USING HNSW (embedding vector_cosine_ops);