from fastapi import HTTPException, Depends, Form
from fastapi import APIRouter
from fastapi.responses import JSONResponse
from fastapi.security import OAuth2PasswordBearer

from utils.dependencies import DBCxn
from core.config import Settings
from schema.authentication import JWTPayload
from backend.src.database import notebooks
from components.authentication.access_token import verifyJWT
from jwt import PyJWTError

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/token")
router = APIRouter(prefix="/chat/message", tags=["chat messages"])

# load specific chat (return chat history)
@router.get("/history/{chatId}/")
async def load_chat_history():
    pass

# send message, return LLM response
# frontend will append this to list
@router.put("/send/{chatId}")
async def send_message():
    pass

@router.patch("/edit/{messageId}")
async def edit_message():
    pass