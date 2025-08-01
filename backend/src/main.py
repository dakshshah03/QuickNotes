from fastapi import FastAPI, UploadFile, File
from fastapi import HTTPException, Depends
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware

from contextlib import asynccontextmanager
from typing import Annotated

# local imports
from database.db import db_instance
from components.rag.pdf_parser import parse_document
from components.rag.vector_store import DocumentVectorDB
from core.config import Settings

# router imports
from routers.chat import messages, pdf
from routers.authentication import login

@asynccontextmanager
async def lifespan(app: FastAPI):
    print("Starting Application: Initializing database connection pool...")
    try:
        db_instance.connect(min_conn=1, max_conn=10)
        yield
    finally:
        print("Application Shutdown: Closing database connection pool...")
        db_instance.close()

# print(Settings.password_hasher.hash("TestPW"))

app = FastAPI(lifespan=lifespan)

vector_db_instance = DocumentVectorDB()

def get_vector_db() -> DocumentVectorDB:
    return vector_db_instance

origins = [
        "http://localhost",
        "http://localhost:3000"
    ]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"], 
    allow_headers=["*"], 
)

app.include_router(pdf.router)
app.include_router(login.router)


