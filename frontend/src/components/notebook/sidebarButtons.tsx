import React, { useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { uploadPDF } from '@/api/document';
import { useNotebookContext } from '@/app/notebooks/[notebookId]/layout';

export const UploadPDFButton = () => {
    const { notebookId, selectedFile, setSelectedFile } = useNotebookContext();
    const router = useRouter();
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
            grid min-w-full
            h-[50px]
            rounded-full
            bg-[#4729297a]
            hover:bg-[#693c3c42]
            hover:translate-y-[-3px]
            hover:shadow-xl/50
            text-left
            truncate
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

export const DocumentTIle = ( { documentName } : { documentName: string}) => {
    return (
        <div className={`
                h-[50px]
                pl-[20px]
                pr-[20px]
                hover:rounded-full
                hover:bg-[#72727242]
                hover:translate-y-[-3px]
                hover:shadow-xl/50
                text-left
                flex
                items-center
                truncate
            `}>
            <span className="truncate">
                {documentName}
            </span>
        </div>
    )
};

export const ChatTile = ({ chatName }: { chatName: string }) => {
    return (
        <div className={`
                h-[50px]
                pl-[20px]
                pr-[20px]
                hover:rounded-full
                hover:bg-[#72727242]
                hover:translate-y-[-3px]
                hover:shadow-xl/50
                text-left
                flex
                items-center
                truncate
            `}>
            <span className="truncate">
                {chatName}
            </span>
        </div>
    )
};