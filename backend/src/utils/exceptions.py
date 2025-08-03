class UserNotFoundError(Exception):
    def __init__(self, message="User not found."):
        self.message = message
        super().__init__(self.message)
class NotebookNotFoundError(Exception):
    def __init__(self, message="Notebook not found."):
        self.message = message
        super().__init__(self.message)
        
        