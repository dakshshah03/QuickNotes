from fastapi import HTTPException
from fastapi import APIRouter
from fastapi.responses import JSONResponse

router = APIRouter(prefix="/authentication", tags=["authentication login logout"])
# login, logout