from llama_index.core import VectorStoreIndex, Document
from llama_index.core.schema import TextNode
from llama_index.core.settings import Settings
from llama_index.core.storage.storage_context import StorageContext
from llama_index.embeddings.huggingface import HuggingFaceEmbedding
from llama_index.vector_stores.postgres import PGVectorStore

from core import config
from typing import List, Optional, Dict
from pydantic import BaseModel
from uuid import UUID

class VectorDB:
    def __init__(
        self,
        DB_HOST: str = config.Settings.db_host,
        DB_USERNAME: str = config.Settings.db_user,
        DB_PASSWORD: str = config.Settings.db_pw,
        DB_NAME: str = config.Settings.db_name,
        DB_PORT: str = config.Settings.db_port
    ):
        Settings.embed_model = HuggingFaceEmbedding(model_name="sentence-transformers/all-MiniLM-L6-v2") 
        Settings.llm = None
        
        # vector store for document chunks
        self.doc_vector_store = PGVectorStore.from_params(
            database=DB_NAME,
            host=DB_HOST,
            port=int(DB_PORT),
            user=DB_USERNAME,
            password=DB_PASSWORD,
            table_name="document_embeddings",
            embed_dim=384
        )
        self.doc_index = VectorStoreIndex.from_vector_store(vector_store=self.doc_vector_store)
        self.doc_query_engine = self.doc_index.as_query_engine()
        
        # vector store for previous chat QA
        self.chat_vector_store = PGVectorStore.from_params(
            database=DB_NAME,
            host=DB_HOST,
            port=int(DB_PORT),
            user=DB_USERNAME,
            password=DB_PASSWORD,
            table_name="message_embeddings",
            embed_dim=384
        )
        self.chat_index = VectorStoreIndex.from_vector_store(vector_store=self.chat_vector_store)
        self.chat_query_engine = self.chat_index.as_query_engine()
        
    def insert_document(self, parsed_pdf: str, documentMetadata: Dict) -> None:
        document = Document(text=parsed_pdf, metadata=documentMetadata)
        self.doc_index.add_documents([document])

    def insert_chat_message(self, message_text: str, chatMetadata: Dict) -> None:
        message = Document(text=message_text, metadata=chatMetadata)
        self.chat_index.add_documents([message])

    def query_documents_by_metadata(self, metadata_filter: Dict) -> List[Document]:
        results = self.doc_index.query(filters=metadata_filter)
        return results

    def query_chats_by_metadata(self, metadata_filter: Dict) -> List[Document]:
        results = self.chat_index.query(filters=metadata_filter)
        return results

vector_db_instance = VectorDB()