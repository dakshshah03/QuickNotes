from pydantic import BaseModel, ConfigDict, Field
from datetime import datetime
from uuid import UUID

class NotebookCreate(BaseModel):
    notebook_name: str = Field(..., min_length=1, max_length=255)

class NotebookDB(NotebookCreate):
    notebook_owner: UUID # used to filter notebooks for a given user
    notebook_id: UUID # unique id for notebooks, to be connected to pdfs
    pdf_storage_dir: str = Field(..., min_length=1, max_length=255)# path containing all pdfs for this notebook, probably change to an S3 store if I get funds
    creation_time: datetime
    updated_time: datetime 
    
class NotebookResponse(BaseModel):
    notebook_id: UUID
    notebook_name: str
    creation_time: datetime
    updated_time: datetime 
    num_pdfs: int = 0
    