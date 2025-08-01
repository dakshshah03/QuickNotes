'use client';

import React, { useState, type FormEvent} from 'react';
import { useRouter } from 'next/navigation';
import { loadNotebookList } from '@/api/dashboard';

function NotebookSelector() {
    const [message, setMessage] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const router = useRouter();

    const handleNotebookSelector = async () => {

        const data = await loadNotebookList(
            router,
            setIsLoading,
            setMessage
        );
    };

    return (
        <div className={`
            content-center
            bg-linear-to-t from-[#0d4250] to-[#5f505c]
            h-[100vh]
            w-[100vw]`}>
            
        </div>
    )
};

export default NotebookSelector;