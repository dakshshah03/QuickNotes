from fastapi import HTTPException, Depends, Form
from fastapi import APIRouter
from fastapi.responses import JSONResponse
from fastapi.security import OAuth2PasswordBearer

from uuid import UUID
from typing import Set, List

from utils.dependencies import DBCxn
from core.config import Settings
from components.authentication.access_token import verifyJWT

from database.notebook.notebook import fetch_owner
from database.chats.chat import fetch_chat_owner
from database.chats.messages import fetch_message_history, messageMetadata


oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/token")
router = APIRouter(prefix="/chat/messages", tags=["chat messages"])

# load specific chat (return chat history)
@router.get("/history/{notebookId}/{chatId}/")
async def load_chat_history(
        conn: DBCxn,
        notebookId: UUID,
        chatId: UUID,
        token: str = Depends(oauth2_scheme)
    ):
    payload = verifyJWT(token)
    user_id = UUID(payload.get("user_id"))
    
    notebook_owner = fetch_owner(conn, notebookId)
    if user_id != notebook_owner:
        raise HTTPException(
            status_code=403,
            detail=f"User {user_id} does not have access to resource."
        )
        
    chat_owner = fetch_chat_owner(conn, chatId)
    if chat_owner != notebookId:
        raise HTTPException(
            status_code=403,
            detail=f"User {user_id} does not have access to resource."
        )
    
    messages: List[messageMetadata] = fetch_message_history(
        conn, parent_chat=chatId
    )
    
    return {
        "messageHistory": messages
    }

# send message, return LLM response
# frontend will append this to list
@router.put("/send")
async def send_message(
        conn: DBCxn,
        notebookId: UUID = Form(...),
        chatId: UUID = Form(...),
        userPrompt: str = Form(...),
        activeDocuments: Set = Form(...),
        token: str = Depends(oauth2_scheme)
    ):
    payload = verifyJWT(token)
    user_id = UUID(payload.get("user_id"))
    notebook_owner = fetch_owner(conn, notebookId)
    
    if user_id != notebook_owner:
        raise HTTPException(
            status_code=403,
            detail=f"User {user_id} does not have access to resource."
        )
        
    # TODO: embed messages in vector DB
    # TODO: query both vector tables for context
    
    pass

@router.patch("/edit/{messageId}")
async def edit_message():
    pass