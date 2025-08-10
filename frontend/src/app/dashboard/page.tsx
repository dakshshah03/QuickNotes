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
    const [showInput, setShowInput] = useState<boolean>(false);
    const router = useRouter();

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const accessToken = localStorage.getItem('access_token');
            if (!accessToken) {
                router.push('/auth/login');
                return;
            }
        }
    }, []);

    const fetchNotebookList = async () => {
        await loadNotebookList(
            router,
            setNotebooks,
            setIsLoading,
            setMessage
        );
    };

    const handleCreateNotebook = async (notebookName: string) => {
        try {
            const nb_id = await createNotebook(router, notebookName, notebooks, setNotebooks, setIsLoading, setMessage);
            setShowInput(false);
            setName(''); 
            router.push(`/notebooks/${nb_id}/`);
        } catch (error) {
            console.error('Failed to create notebook:', error);
        }
    };

    useEffect(() => {
        if(name !== '') {
            handleCreateNotebook(name);
        }
    }, [name]);

    useEffect(() => {
        fetchNotebookList();
    }, []);

    return (
        <div className={`
                bg-linear-to-t from-[#0d4250] to-[#5f505c]
                h-full
                w-full
                flex
                flex-col
            `}>
                
            {showInput && <CreateNotebookInput setName={setName} />}
            <div className={`
                    flex-1
                    w-full
                    grid
                    grid-cols-[repeat(auto-fit,minmax(200px,1fr))]
                    gap-10
                    p-[100px]
                    justify-items-center
                    overflow-y-auto
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
                        <NotebookTile notebook_name={nb.notebook_name} updated_time={nb.updated_time}/>
                    </button>
                ))}
            </div>
        </div>
        
    )
};

export default NotebookSelector;