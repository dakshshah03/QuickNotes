from pydantic import BaseModel
from fastapi import HTTPException

from typing import List, Optional, Dict, Set
from pydantic import BaseModel
from uuid import UUID
from datetime import datetime
import psycopg

from database.vectordb import vector_db_instance

class messageMetadata(BaseModel):
    message_id: Optional[UUID] = None
    parent_chat: UUID
    user_prompt: str
    llm_response: Optional[str] = None
    creation_time: Optional[datetime] = None
    
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

def create_message(
        conn: psycopg.Connection,
        message: messageMetadata
    ) -> messageMetadata:
    """
    Inserts a new message into message_history
    without llm response

    Args:
        conn (psycopg.Connection): _description_
        message (messageMetadata): _description_

    Returns:
        messageMetadata: _description_
    """
    cursor = None
    try:
        cursor = conn.cursor()
        create_message_query="""
        INSERT INTO message_history
        (parent_chat, user_prompt)
        VALUES (%s, %s)
        RETURNING message_id, creation_time
        """
        
        cursor.execute(create_message_query, (message.parent_chat, message.user_prompt))
        
        result = cursor.fetchone()
        if result:
            message_id, creation_time = result[0], result[1].isoformat()
            message.message_id = message_id
            message.creation_time = creation_time

    except psycopg.Error as e:
        print(f"Error inserting message {message.message_id} into message_history: {e}")
        raise HTTPException(
            status_code=500,
            detail="Database error occurred while sending message"
        )
        
    return message

def set_llm_response(
        conn: psycopg.Connection,
        messageId: UUID,
        llm_response: str
    ):
    """
    updates the llm response of a created message
    
    Args:
        conn (psycopg.Connection): _description_
        messageId (UUID): _description_
        llm_response (str): _description_
    """
    cursor = None
    
    try:
        cursor = conn.cursor()
        update_message_query="""
        UPDATE message_history
        SET llm_response = %s
        WHERE message_id = %s;
        """
        
        cursor.execute(update_message_query, (llm_response, messageId,))
        
    except psycopg.Error as e:
        print(f"Error updating message {messageId} with LLM response: {e}")
        raise HTTPException(
            status_code=500,
            detail="Database error occurred while inserting llm message"
        )