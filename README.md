MVP features

Frontend:
- react
- login page
    
- notebook picker (limit to 5 notebooks, 2 pdfs each max 20 pages)
    - upload pdfs
    - activate/deactivate pdfs
    - chat window
    - llm-side chat
    - user-side chat
Backend:
- database: postgres
    - user information
        - username
        - hashed password
        - notebook names
    - notebooks
        - user id
        - notebook names
        - 
- api: fastapi

API (inbound):
- login 
    - password
    - username
    - authenticates and creates session token using python-jose JWT
    - frontend server stores it in localstorage/cookies
    - every api request from frontend server includes session token
- create-notebook
    - user_id
    - notebook name
- upload-pdf
- update_pdf_state
    - state: {delete, activate, deactivate}
    - notebook_id
    - user_id


llm:
- parsing: llamaparse
- vectordb: pgvector
- embedder: huggingface all-MiniLM-L6-v2
- model: gemini or openai


Future goals:
- non google login
- sign up:
    - first name
    - last name
    - email
        - confirm email
    
- login:
    - email
    - password
    