CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE IF NOT EXISTS users (
    user_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(100) UNIQUE NOT NULL,
    name VARCHAR(50) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    creation_time TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS notebooks (
    notebook_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    notebook_owner UUID NOT NULL,
    notebook_name VARCHAR(255) NOT NULL,
    pdf_storage_dir VARCHAR(255) NOT NULL,
    creation_time TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_time TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS chats (
    chat_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    parent_notebook UUID NOT NULL,
    chat_name VARCHAR(30) NOT NULL,
    creation_time TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_time TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS documents (
    document_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    parent_notebook UUID NOT NULL,
    document_name VARCHAR(255) NOT NULL,
    creation_time TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS document_embeddings (
    id UUID PRIMARY KEY, 
    content TEXT,
    metadata JSONB,
    embedding VECTOR(384) -- 384 is for <all-MiniLM-L6-v2> model
);

-- Begin transaction to ensure atomicity
BEGIN;

-- Insert temporary test data
INSERT INTO users (user_id, email, name, password_hash) VALUES 
    ('550e8400-e29b-41d4-a716-446655440000', 'temp.user@example.com', 'Temp User', '$argon2id$v=19$m=32768,t=3,p=2$g9lbJ7eBB3tANU3atxlvdA$zLpl2varquUJ/Iim1cIwY6jtaAioMZMlWBE+SvBS6t4');

INSERT INTO notebooks (notebook_id, notebook_owner, notebook_name, pdf_storage_dir) VALUES 
    ('550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440000', 'Temp Notebook', '/tmp/notebooks/temp_notebook');

-- Commit the transaction
COMMIT;

-- Verify the data was inserted
SELECT 'Users inserted:' as info, COUNT(*) as count FROM users;
SELECT 'Notebooks inserted:' as info, COUNT(*) as count FROM notebooks;
SELECT * FROM users;
SELECT * FROM notebooks;


