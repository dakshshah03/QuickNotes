# TODO: create function to retrieve message context
# TODO: take context, construct prompt
# TODO: send constructed prompt to LLM (./llm/...)
# TODO: take response, return to messages.py
# 
from fastapi import HTTPException
from psycopg import Connection
from typing import List, Dict, Set
from uuid import UUID
from pydantic import BaseModel

from database.vectordb import vector_db_instance
from llama_index.core.vector_stores import MetadataFilter, MetadataFilters, FilterOperator


def retrieve_context(
        conn: Connection,
        query: str,
        active_documents: Set[UUID]
    ) -> List[str]:
    """
    creates a list of strings as context

    Args:
        conn (Connection): _description_
        query (str): _description_
        active_documents (Set): _description_

    Returns:
        List[str]: _description_
    """
    document_list = None
    
    try:
        metadata_filter = MetadataFilters(
            filters=[
                MetadataFilter(
                    key="document_id",
                    value=[str(doc_id) for doc_id in active_documents],
                    operator=FilterOperator.IN
                )
            ]
        )
        
        results = vector_db_instance.retrieve_documents(
            query_text=query,
            top_k=2,
            metadata_filter=metadata_filter
        )
        
        document_list = [doc.text for doc in results]
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Could not retrieve documents: {e}"
        )
    
    return document_list

