from llama_index.core import VectorStoreIndex, Document
from llama_index.core.schema import TextNode
from llama_index.core.settings import Settings
from llama_index.core.storage.storage_context import StorageContext
from llama_index.embeddings.google_genai import GoogleGenAIEmbedding
from google.genai.types import EmbedContentConfig
from llama_index.vector_stores.postgres import PGVectorStore
from llama_index.core.schema import BaseNode

from core import config
from typing import List, Optional, Dict
from pydantic import BaseModel
from uuid import UUID
import psycopg

class VectorDB:
    def __init__(
        self,
        DB_HOST: str = config.Settings.db_host,
        DB_USERNAME: str = config.Settings.db_user,
        DB_PASSWORD: str = config.Settings.db_pw,
        DB_NAME: str = config.Settings.db_name,
        DB_PORT: str = config.Settings.db_port
    ):
        self.doc_embed_model = Settings.embed_model = GoogleGenAIEmbedding(
            model_name="models/gemini-embedding-001",
            task_type="RETRIEVAL_DOCUMENT",
            title="document_embedding",
            embedding_config=EmbedContentConfig(output_dimensionality=768)
        )
        Settings.llm = None
        
        # vector store for document chunks
        self.doc_vector_store = PGVectorStore.from_params(
            database=DB_NAME,
            host=DB_HOST,
            port=DB_PORT,
            user=DB_USERNAME,
            password=DB_PASSWORD,
            table_name="document_embeddings",
            embed_dim=768,
            use_jsonb=True,
            hnsw_kwargs={
                "hnsw_m": 16,
                "hnsw_ef_construction": 64,
                "hnsw_ef_search": 40,
                "hnsw_dist_method": "vector_cosine_ops",
            },
        )
        
        self.doc_index: VectorStoreIndex = VectorStoreIndex.from_vector_store(vector_store=self.doc_vector_store)
        
        self.query_embed_model = GoogleGenAIEmbedding(
            model_name="models/gemini-embedding-001",
            task_type="QUESTION_ANSWERING",
            title="query_embedding",
            embedding_config=EmbedContentConfig(output_dimensionality=768)
        )
        
        
    def store_document(self, chunked_pdf: List[BaseNode]) -> None:
        try:
            Settings.embed_model = self.doc_embed_model
            
            print(f"Inserting {len(chunked_pdf)} nodes into vector store...")
            self.doc_index.insert_nodes(chunked_pdf)
            print("Successfully stored document chunks with optimized embeddings")
        except Exception as e:
            print(f"Error storing document chunks: {e}")
            raise

    def retrieve_documents(self, query_text: str, top_k: int = 2, metadata_filter: Optional[Dict] = None) -> List[Document]:
        try:
            Settings.embed_model = self.query_embed_model
            
            retriever = self.doc_index.as_retriever(
                similarity_top_k=top_k, 
                filters=metadata_filter
            )
            results = retriever.retrieve(query_text)
            
            return [node.node for node in results]
        except Exception as e:
            print(f"Error retrieving documents: {e}")
            raise

vector_db_instance = VectorDB()