import psycopg
from uuid import UUID
from pydantic import BaseModel 
from typing import List

class chunk_metadata(BaseModel):
    

def insert_pdf_chunks(
        conn: psycopg.connection
    ):
    """
    Given a list of documents, inserts chunks into the document_embeddings table

    Args:
        conn (psycopg.connection): _description_
        notebook_id (UUID): _description_
        chat_id (UUID): _description_
    """
    