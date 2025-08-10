from fastapi import HTTPException, APIRouter, status
from fastapi.responses import JSONResponse
# from fastapi.security import Oauth

from uuid import UUID
from pydantic import BaseModel, EmailStr
from typing import Set, List
import jwt
import datetime

from utils.dependencies import DBCxn
from core.config import Settings
from schema.authentication import JWTPayload
from database.users.create import create_user


router = APIRouter(prefix="/user", tags=["user"])

class CreateUserRequest(BaseModel):
    name: str
    email: EmailStr
    password: str

@router.post("/create", response_model=dict, status_code=status.HTTP_201_CREATED)
async def create_account(
        conn: DBCxn,
        request: CreateUserRequest
    ):
    
    try:
        hashed_password = Settings.password_hasher.hash(request.password)
        user_id = create_user(conn, request.email, request.name, hashed_password)
        
        jwt_payload = JWTPayload(user_id=user_id)
        jwt_claim = jwt_payload.model_dump(mode='json')
        jwt_claim["exp"] = datetime.datetime.now(datetime.UTC) + datetime.timedelta(hours=12)
        
        encoded_jwt = jwt.encode(jwt_claim, Settings.jwt_secret_key, Settings.jwt_algorithm)
        
        return {
            "access_token": encoded_jwt,
            "token_type": "bearer",
            "user_id": user_id
        }
    
    except Exception as e:
        print(f"Error creating user account: {e}")
        raise HTTPException(
            status_code=500,
            detail="Failed to create user account"
        )

@router.patch("/edit")
async def edit_user():
    pass

@router.delete("/delete")
async def delete_user():
    pass