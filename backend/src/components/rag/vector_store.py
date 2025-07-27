from sentence_transformers import SentenceTransformer
from langchain_core.documents import Document
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_postgres import 
import pymupdf4llm
from langchain.text_splitter import MarkdownTextSplitter, RecursiveCharacterTextSplitter
from uuid import uuid4

#TODO: Switch to pgvector from chromadb

class StatelessVectorDatabase:
    def __init__(self):
        self.embeddings = HuggingFaceEmbeddings(
            model_name="sentence-transformers/all-MiniLM-L6-v2",
            
        )
        self.vector_store_docs = Chroma(
            collection_name="file_context",
            embedding_function=self.embeddings,
        )
        
        self.vector_store_msgs = Chroma(
            collection_name="messages",
            embedding_function=self.embeddings
        )
        
    def pdf_to_chunk(self, user_id: str, pdf_path: str, chunk_size: int = 500, chunk_overlap: int = 50) -> list[Document]:
        """
        Parses a pdf, extracts text, then returns pdf contents as a list of langchain documents.
        Each document is assigned a UUID (for filtering)
        """
        pdf_md = pymupdf4llm.to_markdown(pdf_path)
        
        text_splitter = MarkdownTextSplitter.from_tiktoken_encoder(
            encoding_name="cl100k_base",
            chunk_size=chunk_size,
            chunk_overlap=chunk_overlap
        )
        
        pdf_uuid = str(uuid4()) # generates a unique one per pdf
        metadata = {
            "user_id": user_id,
            "pdf_uuid": pdf_uuid,
            "format": "markdown",
            "source": pdf_path
        }
        
        md_doc = Document(page_content=pdf_md, metadata=metadata)
        chunks = text_splitter.split_documents([md_doc])
        
        for i, chunk in enumerate(chunks):
            chunk.id = i
        
        return chunks, pdf_uuid

    def retrieve_data(self, msg: str, user_id: str, active_pdfs: list[str]) -> list[Document]:
        
        """
        retrieves the top 5 documents from the vector db

        Args:
            msg (str): User message to query the db with
            active_pdfs (list[str]): list of UUIDs to query the DB with 
        """
        results = self.vector_store_docs.similarity_search_with_score(
            msg,
            k=2,
            filter={"user_id" : user_id}
            # filter={
            #     "$and":
            #         [
            #             {
            #                 "filename" : {"$in": active_pdfs}
            #             },
            #             {
            #                 "user_id" : user_id
            #             }
            #         ]
            # }
        )
        # print(results[0])
        for x in results:
            print(x[0])
        return results
        
        
    def add_pdf(self, documents):
        """
        adds a pdf to the vector store

        Args:
            documents (list[Document]): _description_
        """
        ids = [str(document.id) for document in documents]
        self.vector_store_docs.add_documents(documents=documents, ids=ids)

        
    # def add_message(self, documents):
    #     """
    #     adds a user message to the document store (different metadata?)

    #     Args:
    #         documents (list[Document]): _description_
    #     """
        
    #     pass

x = StatelessVectorDatabase()

chunks, id_num = x.pdf_to_chunk("1", "./2407.01090v2.pdf")
x.add_pdf(chunks)

x.retrieve_data("How does the model query the MLP ", "1", active_pdfs=[id_num])
