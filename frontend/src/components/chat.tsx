import React from 'react';


const ChatTile = ({ chatName }: { chatName: string }) => {

    return (
        <div className={`
                h-[50px]
                w-[250px]
                bg-[#3c7280]
                hover: rounded-full
                hover:brightness-120
                grid
                place-items-center
            `}>
                {chatName}
        </div>
    )
};

export default ChatTile;