import psycopg
from uuid import UUID, uuid4
from pydantic import BaseModel 
from typing import List, Optional
from datetime import datetime

class document(BaseModel):
    id: Optional[UUID] = None
    parent_notebook: UUID
    name: Optional[str] = None
    creation_time: Optional[datetime] = None

def create_document(conn: psycopg.Connection, doc: document) -> document:
    """
    Stores document metadata in a table when user uploads a new document
    
    Args:
        conn (psycopg.Connection): connection to db
        doc (document): fields for parent notebook and name should be filled
    """
    cursor = None
    new_document: document = None
    try:
        cursor = conn.cursor()
        
        insert_doc_query = """
        INSERT INTO documents
        (parent_notebook, document_name)
        VALUES (%s, %s)
        RETURNING document_id, creation_time;
        """
        cursor.execute(insert_doc_query, (doc.parent_notebook, doc.name,))
        
        result = cursor.fetchone()
        if result:
            chat_id, creation_time = result[0], result[1].isoformat()
            new_document = document(
                chat_id=chat_id,
                name=doc.name,
                parent_notebook=doc.parent_notebook,
                creation_time=creation_time
            )
    except psycopg.Error as e:
        if isinstance(e, psycopg.errors.UniqueViolation):
            print(f"UUID duplicate found when inserting new document: {e}")
        else:
            print(f"Error creating document: {e}")
        raise
    finally:
        if cursor:
            cursor.close()
    
    return new_document

def get_document_list(conn: psycopg.Connection, notebook_id: UUID) -> List[document]:
    """
    returns a list of documents associated with a given notebok

    Args:
        conn (psycopg.Connection): connection to db
        notebook_id (UUID): parent notebook

    Returns:
        List[document]: list of documents
    """
    cursor = None
    documents = []
    
    try:
        cursor = conn.cursor()
        retrieve_doc_list_query = """
        SELECT document_id, document_name, creation_time
        FROM documents
        WHERE parent_notebook = %s;
        """
        cursor.execute(retrieve_doc_list_query, (notebook_id,))
        rows = cursor.fetchall()
        for row in rows:
            doc_id, doc_name, creation_time = row[0], row[1], row[2].isoformat()
            notebook_item = document(
               id=doc_id,
               name=doc_name,
               creation_time=creation_time
            )
            documents.append(notebook_item)
        print(f"Successfully retrieved notebook")
    except psycopg.Error as e:
        print(f"Error retrieving notebooks for {notebook_id}: {e}")
        raise
    finally:
        if cursor:
            cursor.close()
    return documents