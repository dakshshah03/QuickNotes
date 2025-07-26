from pydantic import BaseModel, ConfigDict, EmailStr, Field
from datetime import datetime
from uuid import UUID

class UserCreate(BaseModel):
    """
    Model for user creation (meant for user creation API endpoint)
    for POST
    """
    email: EmailStr
    username: str = Field(..., min_length=3, max_length=20)
    name: str = Field(..., min_length=3, max_length=50)
    password: str = Field(..., min_length=8, max_length=30)

class UserDB(UserCreate):
    """
    User data stored in the database, inherits from User_Create
    """
    user_id: UUID
    password_hash: str
    creation_time: datetime
    
    def __init__(self, **data):
        super().__init__(**data)
        self.password = None
        
class UserResponse(BaseModel):
    """
    User data returned on GET
    """
    email: EmailStr
    username: str
    name: str
    user_id: UUID
    creation_time: datetime