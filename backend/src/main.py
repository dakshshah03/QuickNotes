from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi import HTTPException, Depends
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware


# local imports
from components.rag.pdf_parser import parse_document
from components.rag.vector_store import DocumentVectorDB

# router imports
from routers.chat import messages, pdf

app = FastAPI()

vector_db_instance = DocumentVectorDB()

def get_vector_db() -> DocumentVectorDB:
    return vector_db_instance

origins = [
        "http://localhost",
        "http://localhost:5173"
    ]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"], 
    allow_headers=["*"], 
)

app.include_router(pdf.router)
