from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

from fastapi.middleware.cors import CORSMiddleware


messages = [
    {"messageId": 1, "sender": "user", "content": "Hello! Can you help me with my Python project?"},
    {"messageId": 2, "sender": "llm", "content": "Of course! I'd be happy to help you with your Python project. What specific aspect would you like assistance with?"},
    {"messageId": 3, "sender": "user", "content": "I'm trying to understand how to implement a REST API with FastAPI."},
    {"messageId": 4, "sender": "llm", "content": "Great choice! FastAPI is excellent for building REST APIs. You'll want to start by defining your data models with Pydantic and then create your endpoint functions with decorators like @app.get() and @app.post()."},
    {"messageId": 5, "sender": "user", "content": "That sounds helpful. Can you show me an example of a POST endpoint?"},
    {"messageId": 6, "sender": "llm", "content": "Certainly! Here's a basic example: @app.post('/items/') async def create_item(item: Item): return {'message': 'Item created', 'item': item}. The Item would be a Pydantic model defining the expected request body structure."},
    {"messageId": 7, "sender": "user", "content": "Perfect! This is exactly what I needed. Thank you so much!"},
    {"messageId": 8, "sender": "llm", "content": "You're very welcome! Feel free to ask if you have any more questions about FastAPI or Python development. Good luck with your project!"},
]


app = FastAPI()

origins = [
        "http://localhost",
        "http://localhost:5173", # <-- THIS NEEDS TO BE THE EXACT URL OF YOUR REACT APP
        # Example if your React app is on Vite's default port: "http://localhost:5173"
        # Example if your React app is running from an IP: "http://192.168.1.100:3000"
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
    """
    Handles GET requests to retrieve chat history.
    This function skeleton will contain the logic to fetch and return
    a list of past messages.
    """
    return {"messages": messages}

# @app.post("/api/chat/sendmessage")
# async def send_chat_message(payload: MessagePayload):
#     """
#     Handles POST requests to send a new chat message.
#     The 'payload' parameter will automatically parse the JSON request body
#     into a MessagePayload object.
#     This function skeleton will contain the logic to process and store
#     the new message.
#     """
#     pass # No implementation yet