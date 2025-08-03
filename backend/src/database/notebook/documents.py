import psycopg
from uuid import UUID, uuid4
from pydantic import BaseModel 
from typing import List, Optional

class document(BaseModel):
    id: Optional[UUID] = None
    parent_notebook: Optional[UUID]
    name: Optional[str]
    
def store_document(conn: psycopg.Connection, doc: document):
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
            print(f"UUID duplicate found, generating new UUID: {e}")
            store_document(conn, doc)
        else:
            print(f"Error inserting document into table: {e}")
    finally:
        if cursor:
            cursor.close()