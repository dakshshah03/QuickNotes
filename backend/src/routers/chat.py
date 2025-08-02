from fastapi import HTTPException, Depends
from fastapi import APIRouter
from fastapi.responses import JSONResponse
from fastapi.security import OAuth2PasswordBearer

from utils.dependencies import DBCxn
from core.config import Settings
from schema.authentication import JWTPayload
from database.dashboard import notebooks
from components.authentication.access_token import verifyJWT

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/token")
router = APIRouter(prefix="/chat", tags=["authentication login"])

# load specific chat (return chat history)
@router.get("/{chatId}/history")



# send message, return LLM response
# frontend will append this to list
@router.put("/{chatId}/send")