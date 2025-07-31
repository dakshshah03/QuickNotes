from uuid import UUID

def validate_notebook(parentUser: UUID, userID: UUID):
    """
    Validate that the a notebook is owned by
    a given userID
    """
    pass

def validate_chat(parentNotebook: UUID, userID: UUID):
    """
    Validate that the parent notebook of a
    chat is owned by a given userID
    """
    pass

def validate_message(parentChat: UUID, userID: UUID):
    """
    Validate that the parent chat of a sent
    message is owned by a given userID
    """
    pass

