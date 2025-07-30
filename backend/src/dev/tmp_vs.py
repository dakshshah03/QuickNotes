from llama_index.core import VectorStoreIndex, Document
from llama_index.vector_stores.chroma import ChromaVectorStore
from llama_index.embeddings.huggingface import HuggingFaceEmbedding
from llama_index.core.settings import Settings
import os
import chromadb
from typing import Dict


class DocumentVectorDB:
    def __init__(self):
        self.chroma_client = chromadb.EphemeralClient()
        self.chroma_collection = self.chroma_client.create_collection('documents')
        Settings.embed_model = self.embed_model = HuggingFaceEmbedding(model_name="sentence-transformers/all-MiniLM-L6-v2") 
        Settings.llm = None
        
        self.vector_store = ChromaVectorStore(chroma_collection=self.chroma_collection)
        self.index = VectorStoreIndex.from_vector_store(vector_store=self.vector_store)
        self.query_engine = self.index.as_query_engine()
        
        
    def insert_document(self, parsed_pdf: str, metadata: Dict) -> None:
        documents = [Document(text=parsed_pdf, metadata=metadata)]
        self.index = VectorStoreIndex.from_documents(
            documents,
            vector_store=self.vector_store
        )
        
        self.query_engine = self.index.as_query_engine()
    
    def query_documents(self, query: str):
        return self.query_engine.query(query)