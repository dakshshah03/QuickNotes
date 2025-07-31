from pydantic import BaseModel, ConfigDict, Field
from datetime import datetime, timezone 
from uuid import uuid4, UUID
from pydantic import BaseModel, Field, SecretStr, UUID4

class DocumentCreate(BaseModel):
    jwt: SecretStr = Field(
        ...,
        title="JSON Web Token",
        description="JWT for authentication"
    )
    
    parent_notebook: UUID4 = Field(
        ...,
        decription="ID for parent notebook. Obtained from local state"
    )

class DocumentDB(DocumentCreate):
    document_id: UUID = Field(
        default_factory=uuid4,
        description="Unique ID for document, primary key"
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
    