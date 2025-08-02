'use client';

import React, { useEffect, useState} from 'react';
import { useRouter } from 'next/navigation';
import { loadNotebookList } from '@/api/dashboard';
import { notebook } from '@/api/dashboard'
import NotebookBlock from '@/components/notebookBlock';

function NotebookSelector() {
    const [notebooks, setNotebooks] = useState<notebook[]>([])
    const [message, setMessage] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
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
        fetchNotebookList();
    }, []);

    return (
        <div className={`
            bg-linear-to-t from-[#0d4250] to-[#5f505c]
            h-[100vh]
            w-[100vw]`}>
            {
                notebooks.map((nb) => (
                    <div key={nb.updated_time}>
                        <NotebookBlock notebook_name={`${nb.notebook_name}`} updated_time={`${nb.updated_time}`}/>
                    </div>
                ))
            }
        </div>
    )
};

export default NotebookSelector;