from pydantic import BaseModel
from fastapi import HTTPException
from typing import List, Optional, Dict, Set
from uuid import UUID
from datetime import datetime
import psycopg

from database.vectordb import vector_db_instance

class documentMetadata(BaseModel):
    chunk_index: Optional[str]
    parent_notebook: UUID
    document_id: Optional[UUID] # id of original document
    

def fetch_document_chunks():
    pass

def store_document_chunks():
    pass