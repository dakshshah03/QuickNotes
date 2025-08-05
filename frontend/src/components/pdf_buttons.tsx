import React, { useRef, useEffect } from 'react';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { uploadPDF } from '@/api/document';

const UploadPDFButton = ({ router, notebookId, selectedFile, setSelectedFile }: {
    router: AppRouterInstance,
    notebookId: string,
    selectedFile: File | null,
    setSelectedFile: (selectedFile: File | null) => void,
}) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            setSelectedFile(event.target.files[0]);
        } else {
            setSelectedFile(null);
        }
    };

    useEffect(() => {
        if (selectedFile) {
            uploadPDF(router, notebookId, selectedFile);
        }
    }, [selectedFile, notebookId]);

    return(
        <form className={`
            bg-amber-50
            w-10
            h-10
        `}>
            <input
                type="file"
                ref={fileInputRef}
                accept="application/pdf"
                onChange={handleFileChange}
                className="hidden" 
            />
            <button
                type="button"
                onClick={(e) => {
                    e.preventDefault();
                    fileInputRef.current?.click();
                }}
            >
                Upload File
            </button>
        </form>
    )
};

export default UploadPDFButton;