import React from 'react';

// entry box to write message
export const WriteMessage = () => {
    return (
        <form className="
            flex
            min-w-[360px]
            w-4/5
            lg:w-3/5
            mb-[40px]
            rounded-3xl
        ">
            <textarea
                className="
                    flex-1
                    h-full
                    p-[20px]
                    rounded-l-3xl
                    bg-[#00000048]
                    outline-none
                    resize-none
                    align-top
                    overflow-y-auto
                    text-[20px]
                "
                placeholder="Type your message..."
                rows={1}
                style={{ minHeight: '100px', maxHeight: '120px' }}
            />
            <div className="
                w-[120px]
                flex-shrink-0
                ml-auto
                rounded-r-3xl
                bg-amber-700
            ">
                test 2
            </div>
        </form>
    )
}