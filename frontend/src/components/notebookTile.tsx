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

export const CreateNotebookInput = ({ setName }: { setName: (name: string) => void }) => {
    const [inputValue, setInputValue] = React.useState<string>('');

    return (
        <div className="flex flex-col items-center">
            <input
                type="text"
                placeholder="Enter notebook name"
                className="
                border
                border-gray-300
                rounded-md
                p-2
                w-full"
                onChange={(e) => setInputValue(e.target.value)}
            />
            <button
                className="
                mt-2
                 bg-blue-500
                 text-white
                 px-4
                 py-2
                 rounded-md
                 hover:bg-blue-600"
                onClick={() => setName(inputValue)}
            >
                Submit
            </button>
        </div>
    );
};