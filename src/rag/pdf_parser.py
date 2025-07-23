import pymupdf4llm
from langchain.text_splitter import MarkdownTextSplitter
from langchain_core.documents import Document

def pdf_to_chunk(file_name: str, pdf_path: str, chunk_size: int = 500, chunk_overlap: int = 50) -> list[Document]:
    """
    Parses a pdf, extracts text, then returns pdf contents as a list of langchain Documents
    """
    pdf_md = pymupdf4llm.to_markdown(pdf_path)
    
    text_splitter = MarkdownTextSplitter.from_tiktoken_encoder(
        encoding_name="cl100k_base",
        chunk_size=chunk_size,
        chunk_overlap=chunk_overlap
    )
    
    metadata = {"source": pdf_path,"file_name": file_name,"format": "markdown"}
    
    
    md_doc = Document(page_content=pdf_md, metadata=metadata)
    chunks = text_splitter.split_documents([md_doc])
    
    for i, chunk in enumerate(chunks):
        chunk.id = i
    
    return chunks
