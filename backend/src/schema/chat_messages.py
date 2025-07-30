from datetime import datetime, timezone 
from uuid import uuid4
from pydantic import BaseModel, Field, SecretStr, UUID4

# TODO: send message model
# TODO: retrieve message model
class SendMessage(BaseModel):
    jwt: SecretStr = Field(
        ...,
        title="JSON Web Token",
        description="JWT for authentication"
    )
    
    content: str = Field(
        ...,
        decription="Message Contents"
    )
    
    # metadata: parent chat, message id
    message_id: UUID4 = Field(
        default_factory=uuid4,
        description="unique message UUID"
    )
    
    parent_chat: UUID4 = Field(
        ...,
        decription="ID for parent notebook. Obtained from local state"
    )