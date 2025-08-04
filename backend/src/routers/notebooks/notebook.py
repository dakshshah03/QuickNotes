from fastapi import HTTPException, Depends, Form
from fastapi import APIRouter
from fastapi.responses import JSONResponse
from fastapi.security import OAuth2PasswordBearer

from uuid import UUID

from utils.dependencies import DBCxn
from core.config import Settings
from schema.authentication import JWTPayload
from components.authentication.access_token import verifyJWT

from database.notebooks import fetch_owner, insert_notebook, notebook
from database.notebook.documents import get_document_list
from database.notebook.chats import get_chat_list

# TODO: handle clicking notebook (loads notebook)
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/token")
router = APIRouter(prefix="/notebook", tags=["authentication login"])

# load blank chat (loads current notebook after authenticating JWT)
# returns list of chats and documents in a given chat
# only called once per page reload or when new chat is made
@router.get("/load/{notebookId}")
async def load_notebook(
        conn: DBCxn,
        notebookId: UUID,
        token: str = Depends(oauth2_scheme)
    ):
    payload = verifyJWT(token)
    user_id = payload.get("user_id")
    notebook_owner = fetch_owner(conn, notebookId)
    
    if user_id != notebook_owner:
        raise HTTPException(
            status_code=403,
            detail=f"User {user_id} does not have access to resource."
        )
    
    # call function loading documents
    docs = get_document_list(conn, notebookId)
    # call function loading chats in notebook
    chats = get_chat_list(conn, notebookId)
    
    return {
        "documents": docs,
        "chats": chats
    }

# @router.post("/create")
# async def create_notebook(
#         conn: DBCxn,
#         token: str = Depends(oauth2_scheme)
#         notebook_name: str = Form(None)
#     ):
#     payload = verifyJWT(token)
#     user_id = payload.get("user_id")
    
#     nb = notebook(
#         notebook_owner=user_id,
#         notebook_name=
#     )
#     notebook_id = insert_notebook(conn, )