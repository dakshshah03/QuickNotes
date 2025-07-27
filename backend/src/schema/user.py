from pydantic import BaseModel, ConfigDict, EmailStr, Field
from datetime import datetime
from uuid import UUID
from typing import Optional

class UserCreateRequest(BaseModel):
    """
    Model for user creation (meant for user creation API endpoint)
    for POST
    """
    email: EmailStr = Field(
        ...,
        description="The user's unique email address.",
        example="john.doe@example.com"
    )
    username: str = Field(
        ...,
        min_length=3,
        max_length=32,
        description="The user's unique username. Must be between 3 and 32 characters.",
        example="johndoe123",
        pattern=r"^[a-zA-Z0-9_]+$",
    )
    name: str = Field(
        ...,
        min_length=3,
        max_length=50,
        description="The user's full name. Must be between 3 and 50 characters.",
        example="John Doe"
    )
    password: str = Field(
        ...,
        min_length=8,
        max_length=32,
        description="The user's password. Must be between 8 and 32 characters.",
        example="SecureP@ssw0rd!"
    )

class UserDB(UserCreateRequest):
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