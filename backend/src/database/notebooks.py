import psycopg
from uuid import uuid4,UUID
from pydantic import BaseModel 
from typing import List
from fastapi import HTTPException
from typing import Optional

from utils.exceptions import NotebookNotFoundError

class notebook(BaseModel):
    notebook_id: Optional[UUID] = None
    notebook_owner: Optional[UUID] = None
    notebook_name: str
    storage_dir: Optional[str] = None
    updated_time: Optional[str] = None

class notebookList(BaseModel):
    notebooks: List[notebook]

def insert_notebook(conn: psycopg.Connection, nb: notebook) -> notebook:
    """
    inserts a new notebook entry in the DB

    Args:
        conn (psycopg.Connection): _description_
        nb (notebook): notebook model with owner, name, and storage dir

    Returns:
        UUID: generated notebook id
    """
    cursor = None
    new_notebook = None    
    try:
        cursor = conn.cursor()
        create_notebook_query = """
        INSERT INTO notebooks
        (notebook_owner, notebook_name, pdf_storage_dir)
        VALUES (%s, %s, %s)
        RETURNING notebook_id, updated_time;
        """
        cursor.execute(create_notebook_query, (nb.notebook_owner, nb.notebook_name, nb.storage_dir))
        
        result = cursor.fetchone()
        if result:
            notebook_id, updated_time = result[0], result[1].isoformat()
            new_notebook = notebook(
                notebook_id=notebook_id,
                notebook_name=nb.notebook_name,
                updated_time=updated_time
            )
    except psycopg.Error as e:
        if isinstance(e, psycopg.errors.UniqueViolation):
            print(f"UUID duplicate found when creating new notebook: {e}")
            raise
        else:
            print(f"Error creating new notebook: {e}")
            raise
    finally:
        if cursor:
            cursor.close()
    
    return new_notebook

def fetch_notebook_list(conn: psycopg.Connection, notebook_owner: UUID):
    """
    Fetches a list of notebooks to be displayed on dashboard

    Args:
        conn (psycopg.Connection): _description_
        notebook_owner (UUID): UUID of the notebook owner (user ID)
        
    Raises:
        HTTPException: For HTTP-specific errors that should be passed to the client
        psycopg.Error: Database connection or query error
    """
    cursor = None
    notebook_list = notebookList(
        notebooks = []
    )
    
    try:
        cursor = conn.cursor()
        notebook_list_query = """
        SELECT notebook_id, notebook_name, updated_time
        FROM notebooks
        WHERE notebook_owner = %s;
        """
        
        cursor.execute(notebook_list_query, (notebook_owner,))
        
        rows = cursor.fetchall()
        for row in rows:
            notebook_id, notebook_name, updated_time = row[0], row[1], row[2].isoformat()
            
            notebook_item = notebook(
                notebook_id=notebook_id,
                notebook_name=notebook_name,
                updated_time=updated_time
            )
            
            notebook_list.notebooks.append(notebook_item)
        print(f"Successfully retrieved {len(notebook_list.notebooks)} notebooks")
    except psycopg.Error as e:
        print(f"Error retrieving notebooks for {notebook_owner}: {e}")
        raise HTTPException(
            status_code=500,
            detail="Database error occurred while fetching notebooks"
        )
    finally:
        if cursor:
            cursor.close()
            
    return notebook_list


def fetch_owner(conn: psycopg.Connection, notebook_id: UUID) -> UUID:
    """
    returns userId that owns a given notebook
    
    Raises:
        NotebookNotFoundError: When notebook with given ID is not found
        psycopg.Error: Database connection or query error
    """
    cursor = None
    notebook_owner = None
    try:
        cursor = conn.cursor()
        owner_query = """
        SELECT notebook_owner
        FROM notebooks
        WHERE notebook_id = %s;
        """
        
        cursor.execute(owner_query, (notebook_id,))
        
        row = cursor.fetchone()
        
        if row:
            notebook_owner = row[0]
        else:
            raise NotebookNotFoundError(f"No notebook found with id {notebook_id}")
        
    except psycopg.Error as e:
        print(f"Database error retrieving notebook with ID {notebook_id}: {e}")
        raise
    finally:
        if cursor:
            cursor.close()
    
    return notebook_owner
