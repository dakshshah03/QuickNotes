import psycopg
from uuid import UUID, uuid4
from pydantic import BaseModel 
from typing import List, Optional
from datetime import datetime

class document(BaseModel):
    id: Optional[UUID] = None
    parent_notebook: Optional[UUID]
    name: Optional[str]
    creation_time: Optional[datetime]

class documentList(BaseModel):
    documents: List[document]
    
def store_document(conn: psycopg.Connection, doc: document):
    """
    Stores document metadata in a table when user uploads a new document
    
    Args:
        conn (psycopg.Connection): connection to db
        doc (document): fields for parent notebook and name should be filled
    """
    cursor = None
    try:
        cursor = conn.cursor()
        doc_id = uuid4()
        insert_doc_query = """
        INSERT INTO documents
        (document_id, parent_notebook, document_name)
        VALUES (%s, %s, %s);
        """
        cursor.execute(insert_doc_query, (doc_id, doc.parent_notebook, doc.name,))
        
        conn.commit()
    except psycopg.Error as e:
        if isinstance(e, psycopg.errors.UniqueViolation):
            print(f"UUID duplicate found when creating new document, generating new UUID: {e}")
            store_document(conn, doc)
        else:
            print(f"Error inserting document into table: {e}")
    finally:
        if cursor:
            cursor.close()

def get_document_list(conn: psycopg.Connection, notebook_id: UUID) -> documentList:
    """
    returns a list of documents associated with a given notebok

    Args:
        conn (psycopg.Connection): connection to db
        notebook_id (UUID): parent notebook

    Returns:
        documentList: list of documents
    """
    cursor = None
    document_list = documentList(
        documents = []
    )
    
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
            
            document_list.documents.append(notebook_item)
        print(f"Successfully retrieved notebook")
        
    except psycopg.Error as e:
        print(f"Error retrieving notebooks for {notebook_id}: {e}")
    finally:
        if cursor:
            cursor.close()
    
    return document_list