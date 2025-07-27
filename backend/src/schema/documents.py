from pydantic import BaseModel, ConfigDict, Field
from datetime import datetime, timezone 
from uuid import UUID, uuid4

class DocumentCreate(BaseModel):
    document_name: str = Field(
        ...,
        min_length=1,
        max_length=255,
        description="The name of the document. Must be between 1 and 255 characters."
    )
    
    document_text: str

class DocumentDB(DocumentCreate):
    document_id: UUID = Field(
        default_factory=uuid4,
        description="Unique ID for document, primary key"
    )
    
    parent_notebook: UUID = Field(
        ...,
        decription="ID for parent notebook"
    )
    
    document_active: bool = Field(
        default_factory=True,
        description="State for searching documents for context in chat"
    )
    
    created_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc),
        description="Date and time this document was uploaded"
    )
    
class DocumentResponse(BaseModel):
    document_name: str
    document_id: UUID
    parent_notebook: UUID
    document_active: bool
    