import jwt
from datetime import datetime
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
    
    expired_exception = HTTPException(
        status_code=401,
        detail="Token has expired",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    try:
        payload = jwt.decode(token, Settings.jwt_secret_key, algorithms=[Settings.jwt_algorithm])
        user_id: int = payload.get("user_id")
        # exp: int = payload.get("exp")
        
        if user_id is None:
            raise credentials_exception
            
        # # Check if token has expired
        # if exp is None:
        #     raise credentials_exception
            
        # current_time = datetime.utcnow().timestamp()
        # if current_time > exp:
        #     raise expired_exception
            
        return payload
    except jwt.ExpiredSignatureError:
        raise expired_exception
    except jwt.PyJWTError:
        raise credentials_exception

