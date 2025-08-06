from fastapi import HTTPException, Depends, Form
from fastapi import APIRouter
from fastapi.responses import JSONResponse
from fastapi.security import OAuth2PasswordBearer

from uuid import UUID

from utils.dependencies import DBCxn
from core.config import Settings
from schema.authentication import JWTPayload
from components.authentication.access_token import verifyJWT
from jwt import PyJWTError

from database.notebook.notebook import fetch_owner


oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/token")
router = APIRouter(prefix="/chat/message", tags=["chat messages"])

# load specific chat (return chat history)
@router.get("/history/${notebookId}/{chatId}/")
async def load_chat_history(
        conn: DBCxn,
        notebookId: UUID,
        chadId: UUID,
        token: str = Depends(oauth2_scheme)
    ):
    payload = verifyJWT(token)
    user_id = UUID(payload.get("user_id"))
    notebook_owner = fetch_owner(conn, notebookId)
    print(notebook_owner, user_id)
    if user_id != notebook_owner:
        raise HTTPException(
            status_code=403,
            detail=f"User {user_id} does not have access to resource."
        )
    
    pass

# send message, return LLM response
# frontend will append this to list
@router.put("/send/{chatId}")
async def send_message():
    pass

@router.patch("/edit/{messageId}")
async def edit_message():
    pass