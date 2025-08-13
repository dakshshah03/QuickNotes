from fastapi import HTTPException, Depends, Form
from fastapi import APIRouter
from fastapi.responses import JSONResponse
from fastapi.security import OAuth2PasswordBearer
import json

from uuid import UUID
from typing import Set, List

from utils.dependencies import DBCxn
from core.config import Settings
from components.authentication.access_token import verifyJWT
from components.rag.message_context import retrieve_context
from components.llm.openai import construct_prompt, query_llm

from database.notebook.notebook import fetch_owner
from database.chats.chat import fetch_chat_owner
from database.chats.messages import fetch_message_history, create_message, set_llm_response, messageMetadata


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
@router.post("/send")
async def send_message(
        conn: DBCxn,
        notebookId: UUID = Form(...),
        chatId: UUID = Form(...),
        userPrompt: str = Form(...),
        activeDocuments: str = Form(...),
        token: str = Depends(oauth2_scheme)
    ):
    try:
        payload = verifyJWT(token)
        user_id = UUID(payload.get("user_id"))
        active_documents_set = set(json.loads(activeDocuments))
        
        # Validate input
        if not userPrompt.strip():
            raise HTTPException(
                status_code=400,
                detail="User prompt cannot be empty."
            )
        
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
                detail=f"Chat {chatId} does not belong to notebook {notebookId}."
            )
            
        message = messageMetadata(
            parent_chat=chatId,
            user_prompt=userPrompt
        )
        
        new_message = create_message(conn, message)
        prompt_context = retrieve_context(conn=conn, query=userPrompt, active_documents=active_documents_set)
        # print(prompt_context)
        
        prompt = construct_prompt(prompt_context, userPrompt)
        # print(prompt)
        
        llm_response = query_llm(prompt)
        new_message.llm_response = llm_response
        set_llm_response(conn, new_message.message_id, llm_response)

        return new_message
    except HTTPException:
        raise
    except Exception as e:
        print(e)
        raise HTTPException(
            status_code=500,
            detail=f"An unexpected error occurred: {str(e)}"
        )


@router.patch("/edit/{messageId}")
async def edit_message():
    pass