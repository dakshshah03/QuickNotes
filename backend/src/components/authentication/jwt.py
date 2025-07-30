import pyjwt
import os

def create_jwt():
    """
    Creates a JSON Web Token after verifying that the
    user and password hash matches
    """