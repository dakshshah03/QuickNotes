import jwt
from fastapi import HTTPException
from core.config import Settings

def verifyJWT(token: str):
    """
    verifies JSON web token
    """
    credentials_exception = HTTPException(
        status_code=401,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    try:
        payload = jwt.decode(token, Settings.jwt_secret_key, algorithms=[Settings.jwt_algorithm])
        user_id: int = payload.get("user_id")
        if user_id is None:
            raise credentials_exception
        return payload
    except jwt.PyJWTError:
        raise credentials_exception

