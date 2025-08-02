'use client';

import React, { useEffect, useState, type FormEvent} from 'react';
import { useRouter } from 'next/navigation';
import { loadNotebookList } from '@/api/dashboard';
import notebook from '@/api/dashboard'
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
        
        // // Sample data for testing
        // const sampleNotebooks: notebook[] = [
        //     {
        //         notebook_name: "My First Notebook",
        //         updated_time: "2025-07-30T14:30:00Z"
        //     },
        //     {
        //         notebook_name: "Work Notes",
        //         updated_time: "2025-07-29T09:15:00Z"
        //     },
        //     {
        //         notebook_name: "Personal Journal",
        //         updated_time: "2025-07-28T18:45:00Z"
        //     },
        //     {
        //         notebook_name: "Project Ideas",
        //         updated_time: "2025-07-27T12:20:00Z"
        //     },
        //     {
        //         notebook_name: "Meeting Notes",
        //         updated_time: "2025-07-26T16:10:00Z"
        //     }
        // ];

        // setNotebooks(sampleNotebooks);
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