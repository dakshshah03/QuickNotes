import React from 'react';

export const MessageTile = ({
    userPrompt,
    response,
    updatedTime
} : {
    userPrompt: string,
    response?: string,
    updatedTime?: string
}) => {
    return(
        <div>
            <p className="
                text-left
                bg-[#00000048]
                rounded-[15px]
                p-[15px]
                m-[20px_20px_20px_auto]
                max-w-1/2
                w-fit
                text-white
            ">
                {userPrompt}
            </p>
            <p className="
                text-left
                rounded-[10px]
                p-[15px]
                m-[20px_20px_auto_20px]
                w-fit
                box-border
                text-white
            ">
                {response}
            </p>
        </div>  
    )
}