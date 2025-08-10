from pydantic import BaseModel
from fastapi import HTTPException
from typing import List, Optional, Dict, Set
from uuid import UUID
from datetime import datetime

class documentMetadata(BaseModel):
    chunk_index: Optional[str] = None
    parent_notebook: UUID
    document_id: UUID # id of original document