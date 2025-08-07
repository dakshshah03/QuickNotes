# API Endpoints

## Authentication
- `./authentication/login.py`
    - `POST /auth/token/`: login endpoint

TODO:
- `/auth/create/`: create account

### Dashboard/menu
- `./dashboard/dashboard.py`
    - `GET /dashboard/notebooks`: returns list of notebooks

### Notebooks
- `./notebooks/documents.py`
    - `POST /notebook/document/upload`: uploads pdf to the current notebook

- `./notebooks/notebook.py`
    - `GET /notebook/load/{notebookId}`: returns list of documents and chats
    - `POST /notebook/create`: create new notebook

### Chats
- `./chats/messages.py`
    - `POST /chat/send/`: send a message`
    - `GET /chat/history/{notebookId}/{chatId}`: retrieve chat history
TODO:
- `/chat/create`: create new chat
