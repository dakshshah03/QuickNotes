import psycopg
from uuid import UUID, uuid4
from pydantic import BaseModel 
from typing import List, Optional
from datetime import datetime

from utils.exceptions import ChatNotFoundError

class chatMetadata(BaseModel):
    id: Optional[UUID] = None
    parent_notebook: UUID
    name: Optional[str] = None
    updated_time: Optional[str] = None
    
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
                parent_notebook=chat.parent_notebook,
                name=chat.name,
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
    chats: chatMetadata = []
    
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
            chat_id, parent_notebook, chat_name, updated_time = row[0], row[1], row[2], row[3].isoformat()
            
            chat_item = chatMetadata(
               id=chat_id,
               parent_notebook=parent_notebook,
               name=chat_name,
               updated_time=updated_time
            )
            
            chats.append(chat_item)
        print(f"Successfully retrieved notebook")
        
    except psycopg.Error as e:
        print(f"Error retrieving notebooks for {notebook_id}: {e}")
        raise
    finally:
        if cursor:
            cursor.close()
    
    return chats

def fetch_chat_owner(conn: psycopg.Connection, chat_id: UUID) -> UUID:
    """
    returns notebookId that owns a given chat
    
    Raises:
        ChatNotFoundError: When chat with given ID is not found
        psycopg.Error: Database connection or query error
    """
    cursor = None
    chat_owner = None
    try:
        cursor = conn.cursor()
        owner_query = """
        SELECT parent_notebook
        FROM chats
        WHERE chat_id = %s;
        """
        
        cursor.execute(owner_query, (chat_id,))
        
        row = cursor.fetchone()
        
        if row:
            chat_owner = row[0]
        else:
            raise ChatNotFoundError(f"No chat found with id {chat_id}")
        
    except psycopg.Error as e:
        print(f"Database error retrieving chat with ID {chat_id}: {e}")
        raise
    finally:
        if cursor:
            cursor.close()
    return chat_owner