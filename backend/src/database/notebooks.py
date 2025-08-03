import psycopg
from uuid import UUID
from pydantic import BaseModel 
from typing import List

from utils.exceptions import NotebookNotFoundError

class notebook(BaseModel):
    notebook_name: str
    updated_time: str

class notebookList(BaseModel):
    notebooks: List[notebook]

def fetch_notebook_list(conn: psycopg.Connection, notebook_owner: UUID):
    """
    Fetches a list of notebooks to be displayed on dashboard

    Args:
        conn (psycopg.Connection): _description_
        notebook_owner (UUID): UUID of the notebook owner (user ID)
    """
    cursor = None
    notebook_list = notebookList(
        notebooks = []
    )
    
    try:
        cursor = conn.cursor()
        notebook_list_query = """
        SELECT notebook_name, updated_time
        FROM notebooks
        WHERE notebook_owner = %s;
        """
        
        cursor.execute(notebook_list_query, (notebook_owner,))
        
        rows = cursor.fetchall()
        for row in rows:
            notebook_name, updated_time = row[0], row[1].isoformat()
            
            notebook_item = notebook(
                notebook_name=notebook_name,
                updated_time=updated_time
            )
            
            notebook_list.notebooks.append(notebook_item)
        print(f"Successfully retrieved notebook")
    except psycopg.Error as e:
        print(f"Error retrieving notebooks for {notebook_owner}: {e}")
    finally:
        if cursor:
            cursor.close()
            
    return notebook_list


def fetch_owner(conn: psycopg.Connection, notebook_id: UUID) -> UUID:
    """
    returns userId that owns a given notebook
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
    finally:
        if cursor:
            cursor.close()
    
    return notebook_owner