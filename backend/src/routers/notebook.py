from fastapi import HTTPException, Depends
from fastapi import APIRouter
from fastapi.responses import JSONResponse
from fastapi.security import OAuth2PasswordBearer

from utils.dependencies import DBCxn
from core.config import Settings
from schema.authentication import JWTPayload
from backend.src.database import notebooks
from components.authentication.access_token import verifyJWT

# TODO: handle clicking notebook (loads notebook)
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/token")
router = APIRouter(prefix="/notebooks", tags=["authentication login"])

# load blank chat (loads current notebook after authenticating JWT)
# should return chat list and nothing else
@router.get("/{notebookId}")

# # returns 
# @router.get("")