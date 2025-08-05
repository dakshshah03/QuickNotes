'use client';

import React, { useEffect, useState} from 'react';
import { useRouter } from 'next/navigation';
import { loadNotebookList } from '@/api/dashboard';
import { notebook } from '@/api/dashboard'
import { NotebookTile, CreateNotebookInput } from '@/components/notebookTile';
import { createNotebook } from '@/api/notebooks';

function NotebookSelector() {
    const [notebooks, setNotebooks] = useState<notebook[]>([]);
    const [message, setMessage] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [name, setName] = useState<string>('');
    const [showInput, setShowInput] = useState<boolean>(false); // State to toggle input visibility
    const router = useRouter();

    const fetchNotebookList = async () => {
        const data = await loadNotebookList(
            router,
            setNotebooks,
            setIsLoading,
            setMessage
        );
    };

    useEffect(() => {
        if(name != '') createNotebook(router, name, notebooks, setNotebooks, setIsLoading, setMessage);
    }, [name]);

    useEffect(() => {
        fetchNotebookList();
    }, []);

    return (
        <div className={`
                bg-linear-to-t from-[#0d4250] to-[#5f505c]
            `}>
                
            {showInput && <CreateNotebookInput setName={setName} />}
            <div className={`
                    h-[100vh]
                    w-[100vw]
                    grid
                    grid-cols-[repeat(auto-fit,minmax(200px,1fr))]
                    gap-10
                    p-[100px]
                    justify-items-center
                `}>
                    <button
                        className="w-[200px] h-[200px]"
                        onClick={() => setShowInput(!showInput)}
                    >
                        <NotebookTile notebook_name='Create Notebook'/>
                    </button>
                    {notebooks.map((nb) => (
                        <button
                            className="w-[200px] h-[200px]"
                            key={nb.notebook_id}
                            onClick={() => router.push(`/notebooks/${nb.notebook_id}/`)}
                        >
                            <NotebookTile key={nb.notebook_id} notebook_name={nb.notebook_name} updated_time={nb.updated_time}/>
                        </button>
                    ))}
            </div>
        </div>
        
    )
};

export default NotebookSelector;