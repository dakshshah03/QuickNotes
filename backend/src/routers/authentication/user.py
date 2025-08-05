from fastapi import HTTPException
from fastapi import APIRouter
from fastapi.responses import JSONResponse

router = APIRouter(prefix="/user", tags=["user"])

@router.post("/create")
async def create_user():
    pass

@router.patch("/edit")
async def edit_user():
    pass

@router.delete("/delete")
async def delete_user():
    pass