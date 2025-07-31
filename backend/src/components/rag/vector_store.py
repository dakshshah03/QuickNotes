from llama_index.core import VectorStoreIndex, Document
from llama_index.core.schema import TextNode
from llama_index.core.settings import Settings
from llama_index.core.storage.storage_context import StorageContext
from llama_index.embeddings.huggingface import HuggingFaceEmbedding
from llama_index.vector_stores.postgres import PGVectorStore

import psycopg
from dotenv.main import load_dotenv
import os
from typing import Dict


# TODO: document store
# TODO: chat store
# establishes connection to DB using database.db 

load_dotenv()

class DocumentVectorDB:
    def __init__(self):
        Settings.embed_model = HuggingFaceEmbedding(model_name="sentence-transformers/all-MiniLM-L6-v2") 
        Settings.llm = None
        self.vector_store = PGVectorStore.from_params(
            database=os.environ["POSTGRES_DB_NAME"],
            host=os.environ["POSTGRES_HOST"],
            port=int(os.environ["POSTGRES_PORT"]),
            user=os.environ["POSTGRES_USER"],
            password=os.environ["POSTGRES_PW"],
            table_name="document_embeddings",
            embed_dim=384
        )
        
        self.index = VectorStoreIndex.from_vector_store(vector_store=self.vector_store)
        self.query_engine = self.index.as_query_engine()
        
    def insert_document(self, parsed_pdf: str, metadata: Dict) -> None:
        documents = [Document(text=parsed_pdf, metadata=metadata)]
        self.index = VectorStoreIndex.from_documents(
            documents,
            vector_store=self.vector_store
        )
        
        self.query_engine = self.index.as_query_engine()
    
    def query_documents(self, query: str, filter: Dict) -> str:
        # return self.query_engine.query(query)
        # TODO: filter query based on: parent notebook, active documents
        pass