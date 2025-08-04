# API Endpoints

## Authentication
- `./authentication/login.py`
    - `POST /auth/token/`: login endpoint

TODO:
- `/auth/create/`: create account

### Dashboard
-`./dashboard/dashboard.py`
    - `GET /dashboard/notebooks`: returns list of notebooks

### Notebooks
- `./notebooks/documents.py`
    - `POST /notebook/document/upload`: uploads pdf to the current notebook

- `./notebooks/notebook.py`
    - `GET /notebook/load/{notebookId}`: returns list of documents and chats

TODO:
- `/notebook/create`: create new notebook

### Chats
TODO:
- `/chat/create`: create new chat
- `/chat/send`: send a message
- `/chat/`: retrieve chat history
