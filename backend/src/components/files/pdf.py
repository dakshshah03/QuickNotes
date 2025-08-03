import shutil
import os
from fastapi.responses import JSONResponse
from fastapi import UploadFile, HTTPException


def save_pdf(file: UploadFile, save_dir: str):
    filename = os.path.basename(file.filename)
    file_location = os.path.join(save_dir, filename)
    try:
        with open(file_location, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        return JSONResponse(
            status_code=200,
            content={
                "message": "PDF uploaded successfully!",
                "filename": filename,
                "path": os.path.abspath(file_location)
            }
        )
    except Exception as e:
        # Handle potential errors during file saving
        raise HTTPException(
            status_code=500,
            detail=f"Could not save file: {e}"
        )
    finally:
        # Ensure the uploaded file's temporary buffer is closed
        file.file.close()