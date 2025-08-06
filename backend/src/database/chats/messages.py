from pydantic import BaseModel

from typing import List, Optional, Dict
from pydantic import BaseModel
from uuid import UUID

from database.vectordb import vector_db_instance

class messageMetadata(BaseModel):
    id: Optional[UUID] = None
    notebook_id: UUID
    chat_id: UUID
    user_prompt: str
    response: str
    
class messageFilterMetadata(BaseModel):
    