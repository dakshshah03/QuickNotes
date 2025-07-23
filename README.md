MVP features
- upload pdf
    - save pdf to backend cache
    - works with pdfs that have text layers
    - parse pdf
- vector db: chromadb
    
Planned features:
- retain pdf
- retain vector store
- work with pdf that may not contain text (tesseract fallback?)
- login
- separate notebooks (and pdfs in each notebook that can be enabled or disabled)

Current Goals:
- get embedding to work with single pdfs
- implement fastapi endpoints
    - PUT pdf
    