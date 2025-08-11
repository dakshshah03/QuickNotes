import psycopg
from uuid import UUID, uuid4
from pydantic import BaseModel 
from typing import List, Optional, Dict
from datetime import datetime

class ArxivDoc(BaseModel):
    arxiv_id: str
    summary: str # string since itll be xml formatted
    name: str
    
def insert_arxiv_summary(conn: psycopg.Connection, new_doc: ArxivDoc):
    """
    Stores an arxiv document in the database for faster retrieval

    Args:
        conn (psycopg.Connection): _description_
        doc_summary (Dict): _description_
    """
    
    cursor = None
    try:
        cursor = conn.cursor()
        
        insert_arxiv_doc_query = """
        INSERT INTO arxiv_documents
        (arxiv_id, summary, name)
        VALUES (%s, %s, %s);
        """
        cursor.execute(insert_arxiv_doc_query, (new_doc.arxiv_id, new_doc.summary, new_doc.name))
        
    except psycopg.Error as e:
        if isinstance(e, psycopg.errors.UniqueViolation):
            print(f"ArXiv document {new_doc.arxiv_id} already exists: {e}")
        else:
            print(f"Error inserting ArXiv document: {e}")
        raise
    finally:
        if cursor:
            cursor.close()

def get_arxiv_document(conn: psycopg.Connection, arxiv_id: str) -> Optional[ArxivDoc]:
    """
    Retrieves an arxiv document summary from cache
    """
    
    cursor = None
    arxiv_doc = None
    
    try:
        cursor = conn.cursor()
        retrieve_arxiv_query = """
        SELECT arxiv_id, summary, name
        FROM arxiv_documents
        WHERE arxiv_id = %s;
        """
        cursor.execute(retrieve_arxiv_query, (arxiv_id,))
        row = cursor.fetchone()
        
        if row:
            arxiv_doc = ArxivDoc(
                arxiv_id=row[0],
                summary=row[1],
                name=row[2]
            )
    except psycopg.Error as e:
        print(f"Error retrieving ArXiv document {arxiv_id}: {e}")
        raise
    finally:
        if cursor:
            cursor.close()
    
    return arxiv_doc

