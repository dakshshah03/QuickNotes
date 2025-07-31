from fastapi import HTTPException, Depends
from fastapi import APIRouter
from fastapi.responses import JSONResponse
from fastapi.security import OAuth2PasswordBearer

from utils.dependencies import DBCxn
from core.config import Settings
from schema.authentication import JWTPayload
from database.dashboard import notebooks
from components.authentication.jwt import verifyJWT

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/token")
router = APIRouter(prefix="/dashboard", tags=["authentication login"])

@router.get("/notebooks")
async def get_notebooks(
        conn: DBCxn = Depends(),
        token: str = Depends(oauth2_scheme)
    ):
    payload = verifyJWT(token)
    user_id = payload.get("user_id")
    return notebooks.fetch_notebook_list(conn, user_id)


