from pydantic import BaseModel
from fastapi import HTTPException

from typing import List, Optional, Dict
from pydantic import BaseModel
from uuid import UUID
from datetime import datetime
import psycopg

from database.vectordb import vector_db_instance

class messageMetadata(BaseModel):
    message_id: UUID
    parent_chat: UUID
    user_prompt: str
    llm_response: str
    creation_time: datetime
    
def fetch_message_history(
        conn: psycopg.Connection,
        parent_chat: UUID
    ):
    """
    Args:
        conn (psycopg.Connection): _description_
        message (messageMetadata): _description_
    """
    cursor = None
    message_list: List[messageMetadata] = []
    
    try:
        cursor = conn.cursor()
        chat_history_list_query = """
        SELECT message_id, user_prompt, llm_response, creation_time
        FROM message_history
        WHERE parent_chat = %s;
        """

        cursor.execute(chat_history_list_query, (parent_chat,))
        
        rows = cursor.fetchall()
        for row in rows:
            message_id, user_prompt, llm_response, creation_time = row[0], row[1], row[2], row[3].isoformat()
            
            message = messageMetadata(
                message_id=message_id,
                parent_chat=parent_chat,
                user_prompt=user_prompt,
                llm_response=llm_response,
                creation_time=creation_time
            )
            
            message_list.append(message)
            print(f"Successfully retrieved {len(message_list)} messages")
    except psycopg.Error as e:
        print(f"Error retrieving notebooks for {parent_chat}: {e}")
        raise HTTPException(
            status_code=500,
            detail="Database error occurred while fetching notebooks"
        )
    return message_list