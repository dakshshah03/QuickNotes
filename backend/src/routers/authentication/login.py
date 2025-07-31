from fastapi import HTTPException, Depends
from fastapi import APIRouter
from fastapi.responses import JSONResponse
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm

import jwt

from schema.authentication import JWTPayload
from utils.dependencies import DBCxn
from core.config import Settings
from database.authentication import fetch_pw_hash

router = APIRouter(prefix="/auth", tags=["authentication login"])

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/token")

@router.post("/token")
async def login_for_access_token(
        form_data: OAuth2PasswordRequestForm = Depends(),
        conn: DBCxn = Depends()
    ):
    try:
        user_id, pw_hash = fetch_pw_hash(conn, form_data.username)
        Settings.password_hasher.verify(pw_hash, form_data.password)
    except Exception as e:
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    jwt_payload = JWTPayload(user_id=user_id)
    jwt_claim = jwt_payload.model_dump()
    jwt_claim["exp"] = int(jwt_claim["exp"].timestamp())
    jwt_claim["iat"] = int(jwt_claim["iat"].timestamp())
    
    encoded_jwt = jwt.encode(jwt_claim, Settings.jwt_secret_key, Settings.jwt_algorithm)

    return {
        "access_token": encoded_jwt,
        "token_type": "bearer",
        "user_id": user_id,
        "email": form_data.username
    }

async def get_current_user(token: str = Depends(oauth2_scheme)):
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
        return user_id
    except jwt.PyJWTError:
        raise credentials_exception
