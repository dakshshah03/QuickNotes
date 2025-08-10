from pydantic import BaseModel, ConfigDict, EmailStr, Field, SecretStr
from datetime import datetime, timedelta, timezone
from uuid import UUID

class JWTPayload(BaseModel):
    user_id: UUID
    # exp: datetime = Field(
    #     default_factory=lambda: datetime.now(timezone.utc) + timedelta(hours=12)
    # )
    # iat: datetime = Field(
    #     default_factory=datetime.now(timezone.utc)
    # )
    
        