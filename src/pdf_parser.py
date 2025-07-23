import pymupdf4llm
from langchain.text_splitter import MarkdownTextSplitter
from langchain_core.documents import Document

def pdf_to_chunk(pdf_path: str, chunk_size: int = 500, chunk_overlap: int = 50) -> list:
    """
    Parses a pdf, extracts text, then returns pdf contents as a string
    """
    pdf_md = pymupdf4llm.to_markdown(pdf_path)
    
    # splitter = MarkdownTextSplitter(chunk_size=chunk_size, chunk_overlap=chunk_overlap)
    text_splitter = MarkdownTextSplitter.from_tiktoken_encoder(
        encoding_name="cl100k_base",
        chunk_size=chunk_size,
        chunk_overlap=chunk_overlap
    )
    
    metadata = {"source": pdf_path, "format": "markdown"}
    
    
    md_doc = Document(page_content=pdf_md, metadata=metadata)
    chunks = text_splitter.split_documents([md_doc])
    
    for i, chunk in enumerate(chunks):
        chunk.metadata["chunk_id"] = i
    
    return chunks