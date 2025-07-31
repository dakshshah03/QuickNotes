from pydantic import BaseModel, ConfigDict, EmailStr, Field, SecretStr
from datetime import datetime, timedelta
from uuid import UUID

class UserLoginPayload(BaseModel):
    email: EmailStr
    password: SecretStr
    
class JWTPayload(BaseModel):
    user_id: str
    exp: datetime = Field(
        default_factory=lambda: datetime.now(datetime.timezone.utc) + timedelta(hours=12)
    )
    iat: datetime = Field(
        default_factory=datetime.now(datetime.timezone.utc)
    )
    
        