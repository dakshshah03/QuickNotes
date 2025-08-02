import React from 'react';

const NotebookBlock = ({ notebook_name, updated_time }: { notebook_name: string, updated_time: string }) => {
    return (
        <button>
            <div className={`
                    bg-[#88888869]
                    p-6
                    rounded-lg
                    shadow-md
                    mb-6
                    hover:brightness-120
                `}>
                {notebook_name} {updated_time} 
            </div>
        </button>
    )
};

export default NotebookBlock;