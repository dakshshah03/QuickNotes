import React from 'react';

export const NotebookTile = ({ notebook_name, updated_time }: { notebook_name?: string, updated_time?: string }) => {
    return (
        <div className={`
                bg-[#88888869]
                h-[200px]
                w-[200px]
                p-6
                rounded-lg
                shadow-md
                hover:brightness-120
                flex justify-center items-center
                font-bold
            `}>
            {notebook_name} {updated_time} 
        </div>
    )
};