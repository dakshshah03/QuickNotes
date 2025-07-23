from sentence_transformers import SentenceTransformer
from langchain_core.documents import Document
from pdf_parser import pdf_to_chunk
from langchain.vectorstores import Chroma
from langchain_huggingface import HuggingFaceEmbeddings
from uuid import uuid4

class StatelessVectorDatabase:
    # create a different collection for each pdf?
    def __init__(self):
        self.embeddings = HuggingFaceEmbeddings("sentence-transformers/all-MiniLM-L6-v2")
        self.vector_store = Chroma(
            collection_name="file_context",
            embedding_function=self.embeddings,
        )
        
        

    def add_pdf(self, documents):
        """
        adds a pdf to the vector store

        Args:
            documents (list[Document]): _description_
        """
        uuids = [str(uuid4()) for _ in range(len(documents))]
        self.vector_store.add_documents(documents=documents, ids=uuids)

    def add_message(self, documents):
        """
        adds a user message to the document store

        Args:
            documents (list[Document]): _description_
        """
        pass