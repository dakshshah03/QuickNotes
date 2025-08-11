from fastapi import HTTPException, Depends, Form, status, APIRouter
from fastapi.responses import JSONResponse
from fastapi.security import OAuth2PasswordBearer

from uuid import UUID

from utils.dependencies import DBCxn
from core.config import Settings
from database.chats.chat import insert_chat, chatMetadata
from schema.authentication import JWTPayload
from components.authentication.access_token import verifyJWT
from jwt import PyJWTError

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/token")
router = APIRouter(prefix="/chat", tags=["chat CRUD"])

@router.post("/create", status_code=status.HTTP_201_CREATED)
async def create_chat(
        conn: DBCxn,
        chat_name: str = Form(...),
        notebook_id: UUID = Form(...),
        token: str = Depends(oauth2_scheme)
    ):
    new_chat: chatMetadata = None
    try:
        payload = verifyJWT(token)
        user_id = payload.get("user_id")
        
        if not user_id:
            raise HTTPException(
                status_code=401,
                detail="Invalid token payload"
            )
        
        new_chat = chatMetadata(
            parent_notebook=notebook_id,
            name=chat_name
        )
        new_chat = insert_chat(conn, new_chat)
        
    except HTTPException:
        raise
    except PyJWTError:
        raise HTTPException(
            status_code=401,
            detail="Invalid token"
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Internal server error: {e}"
        )
    return new_chat

@router.patch("/name")
async def rename_chat():
    pass

@router.delete("/delete")
async def delete_chat():
    pass