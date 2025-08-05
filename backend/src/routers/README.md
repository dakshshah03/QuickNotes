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
TODO:
- `/chat/create`: create new chat
- `/chat/message/send/{chatId}`: send a message
- `/chat/message/history/{chatId}`: retrieve chat history
