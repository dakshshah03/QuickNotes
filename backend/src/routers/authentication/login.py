from fastapi import HTTPException
from fastapi import APIRouter
from fastapi.responses import JSONResponse

import jwt

from schema.authentication import UserLoginPayload, JWTPayload
from utils.dependencies import DBCxn
from core.config import Settings
from database.authentication import fetch_pw_hash

router = APIRouter(prefix="/auth", tags=["authentication login"])

@router.post("/login")
async def login(payload: UserLoginPayload, conn: DBCxn):
    try:
        user_id, pw_hash = fetch_pw_hash(conn, payload.email)
        Settings.password_hasher.verify(pw_hash, payload.password)
    except Exception as e:
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    # TODO: create JWT
    jwt_payload = JWTPayload(user_id=user_id)
    jwt_claim = jwt_payload.model_dump()
    jwt_claim["exp"] = int(jwt_claim["exp"].timestamp())
    jwt_claim["iat"] = int(jwt_claim["iat"].timestamp())
    
    encoded_jwt = jwt.encode(jwt_claim, Settings.jwt_secret_key, Settings.jwt_algorithm) 
    

    return JSONResponse(
        status_code=200,
        content={
            "message": "Login successful",
            "email": payload.email,
            "jwt": encoded_jwt
        }
    )

@router.post("/logout")
async def logout(payload)