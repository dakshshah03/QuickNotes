import psycopg
from uuid import UUID, uuid4
from pydantic import BaseModel 
from typing import List, Optional
from datetime import datetime

class chatMetadata(BaseModel):
    id: Optional[UUID] = None
    parent_notebook: UUID
    name: Optional[UUID] = None
    updated_time: Optional[datetime] = None
    
def insert_chat(conn: psycopg.Connection, chat: chatMetadata) -> chatMetadata:
    """_summary_

    Args:
        conn (psycopg.Connection): connection to db
        chat (chatMetadata): chat to be inserted (must have parent and name filled)

    Returns:
        _type_: _description_
    """
    cursor = None
    new_chat: chatMetadata = None
    try:
        cursor = conn.cursor()
        insert_chat_query = """
        INSERT INTO chats
        (parent_notebook, chat_name)
        VALUES (%s, %s)
        RETURNING chat_id, updated_time;
        """
        cursor.execute(insert_chat_query, (chat.parent_notebook, chat.name,))
        
        result = cursor.fetchone()
        if result:
            chat_id, updated_time = result[0], result[1].isoformat()
            new_chat = chatMetadata(
                id=chat_id,
                name=chat.name,
                parent_notebook=chat.parent_notebook,
                updated_time=updated_time
            )
    except psycopg.Error as e:
        if isinstance(e, psycopg.errors.UniqueViolation):
            print(f"UUID duplicate found when creating new chat: {e}")
        else:
            print(f"Error creating new chat: {e}")
        raise
    finally:
        if cursor:
            cursor.close()
    
    return new_chat

    
def get_chat_list(conn: psycopg.Connection, notebook_id: UUID) -> List[chatMetadata]:
    """
    returns a list of chats and their associated metadata

    Args:
        conn (psycopg.Connection): connection to db
        notebook_id (UUID): parent notebook

    Returns:
        List[chatMetadata]: lsit of chats and their metadata
    """
    cursor = None
    chats = []
    
    try:
        cursor = conn.cursor()
        retrieve_doc_list_query = """
        SELECT chat_id, parent_notebook, chat_name, updated_time
        FROM chats
        WHERE parent_notebook = %s;
        """
        cursor.execute(retrieve_doc_list_query, (notebook_id,))
        
        rows = cursor.fetchall()
        for row in rows:
            doc_id, doc_name, creation_time = row[0], row[1], row[2].isoformat()
            
            notebook_item = chatMetadata(
               id=doc_id,
               name=doc_name,
               creation_time=creation_time
            )
            
            chats.append(notebook_item)
        print(f"Successfully retrieved notebook")
        
    except psycopg.Error as e:
        print(f"Error retrieving notebooks for {notebook_id}: {e}")
        raise
    finally:
        if cursor:
            cursor.close()
    
    return chats