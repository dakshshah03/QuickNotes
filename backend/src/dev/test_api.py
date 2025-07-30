from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi import HTTPException, Depends
from fastapi.responses import JSONResponse
from pydantic import BaseModel
import shutil
import os
from pdf_parser import *
from tmp_vs import DocumentVectorDB

from fastapi.middleware.cors import CORSMiddleware


messages = [
    {"messageId": 0, "sender": "user", "content": "Hello! Can you help me with my Python project?"},
    {"messageId": 1, "sender": "llm", "content": "Of course! I'd be happy to help you with your Python project. What specific aspect would you like assistance with?"},
    {"messageId": 2, "sender": "user", "content": "I'm trying to understand how to implement a REST API with FastAPI."},
    {"messageId": 3, "sender": "llm", "content": "Great choice! FastAPI is excellent for building REST APIs. You'll want to start by defining your data models with Pydantic and then create your endpoint functions with decorators like @app.get() and @app.post()."},
    {"messageId": 4, "sender": "user", "content": "That sounds helpful. Can you show me an example of a POST endpoint?"},
    {"messageId": 5, "sender": "llm", "content": "Certainly! Here's a basic example: @app.post('/items/') async def create_item(item: Item): return {'message': 'Item created', 'item': item}. The Item would be a Pydantic model defining the expected request body structure."},
    {"messageId": 6, "sender": "user", "content": "Perfect! This is exactly what I needed. Thank you so much!"},
    {"messageId": 7, "sender": "llm", "content": "You're very welcome! Feel free to ask if you have any more questions about FastAPI or Python development. Good luck with your project!"},
]


app = FastAPI()

UPLOAD_DIRECTORY = "./pdfs/"

# Create a global instance of DocumentVectorDB
vector_db_instance = DocumentVectorDB()

def get_vector_db() -> DocumentVectorDB:
    """Dependency to get the shared DocumentVectorDB instance"""
    return vector_db_instance

origins = [
        "http://localhost",
        "http://localhost:5173"
    ]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"], # Allows all HTTP methods (GET, POST, PUT, DELETE, etc.)
    allow_headers=["*"], # Allows all headers
)

class Message(BaseModel):
    messageId: int
    sender: str
    content: str

class chatHistoryPayload(BaseModel):
    messages: list[Message]

@app.get("/api/chat/history")
async def get_chat_history():
    return {"messages": messages}

@app.post("/api/chat/sendmessage")
async def send_chat_message(payload: Message, vector_db: DocumentVectorDB = Depends(get_vector_db)):
    messages.append(payload)
    result = vector_db.query_documents(payload.content)
    print(result)
    
    return payload

@app.post("/api/chat/pdf")
async def upload_pdf(file: UploadFile = File(...), vector_db: DocumentVectorDB = Depends(get_vector_db)):
    if file.content_type != "application/pdf":
        raise HTTPException(
            status_code=400,
            detail=f"Invalid file type. Expected 'application/pdf', but received '{file.content_type}'."
        )
    filename = os.path.basename(file.filename)
    file_location = os.path.join(UPLOAD_DIRECTORY, filename)
        
    try:
        with open(file_location, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        parsed_pages = parse_document(file_location)
        parsed_text = "\n".join([page.markdown for page in parsed_pages])
        metadata = {
            "filename": filename,
            "file_path": file_location,
            "total_pages": len(parsed_pages)
        }
        
        vector_db.insert_document(parsed_text, metadata)
        
        return JSONResponse(
            status_code=200,
            content={
                "message": "PDF uploaded and processed successfully!",
                "filename": filename,
                "path": os.path.abspath(file_location),
                "pages_processed": len(parsed_pages)
            }
        )
    except Exception as e:
        # Handle potential errors during file saving
        raise HTTPException(
            status_code=500,
            detail=f"Could not save file: {e}"
        )
    finally:
        # Ensure the uploaded file's temporary buffer is closed
        file.file.close()
        
@app.post("/api/chat/query")
async def query_documents(query: str, vector_db: DocumentVectorDB = Depends(get_vector_db)):
    try:
        result = vector_db.query_documents(query)
        print(result)
        return {"response": str(result)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Query failed: {e}")