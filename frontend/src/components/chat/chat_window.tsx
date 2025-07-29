import React, { type FormEvent } from 'react';
import { useState, useEffect } from 'react';
import './chat_page.css';
interface MessageSendResponse {
    llmResponse: string;
}

interface APIErrorMessage {
    message: string;
    statusCode?: number;
}

// retrieves message history

interface Message {
    // user:  {
    //     id: string;
    //     name: string;
    // };
    messageId: number;
    sender: string;
    content: string;
}

interface messageHistoryFetchResponse {
    messages: Message[]
}

// interface fetchMessageRequest {
//     user_id: string
// }

const ChatWindow = () => {

    const apiEndpoint = 'http://127.0.0.1:8000/api/';
    const [responseMessage, setResponseMessage] = useState<string>('');
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState(null);
    
    const [messageContent, setMessageContent] = useState<string>('');
    const [nextMessageId, setNextMessageId] = useState<number>(0);

    const messageHistoryEndpoint = apiEndpoint + 'chat/history';
    const sendMessageEndpoint = apiEndpoint + 'chat/sendmessage';
    
    const fetchMessageHistory = async (apiEndpoint: string) => {
        setLoading(true);
        setError(null);
        setResponseMessage('');

        console.log(apiEndpoint)
        try {
            const response = await fetch(apiEndpoint, {
                method: 'GET',
            });

            // if (!response.ok) {
            //     const errorData: APIErrorMessage = await response.json();
            // }

            const data: messageHistoryFetchResponse = await response.json();
            setMessages(data.messages);
            setNextMessageId(data.messages.length);
            console.log(JSON.stringify(data));
            
        } catch(error) {
            if (error instanceof Error) {
                setResponseMessage("An error occurred while fetching message history: " + error.message);
            } else {
                setResponseMessage("An unknown error occurred while fetching message history. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    // sends user message, responds with llm message
    const handleSendMessage = async(apiEndpoint: string, messageContent: string) => {
        if (!messageContent.trim()) return;
        setLoading(true);
        setError(null);
        setResponseMessage('');
        setMessageContent('');

        const messageData: Message = {
            messageId: nextMessageId,
            sender: "user",
            content: messageContent
        }
        setNextMessageId(nextMessageId + 1);
        
        setMessages((prevMessages) => [...prevMessages, messageData]);

        try {
            const response = await fetch(apiEndpoint, {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                },
                body: JSON.stringify(messageData)
            });

            // if (!response.ok) {
            //     const errorData: 
            // }

            const data: MessageSendResponse = await response.json();

            setMessages((prevMessages) => {

                // Append the LLM's response message
                const llmMessage: Message = {
                    messageId: nextMessageId,
                    sender: 'llm',
                    content: data.llmResponse
                };
                return [...prevMessages, llmMessage];
            });

        } catch(error) {
            if (error instanceof Error) {
                setResponseMessage("An error occurred while sending message: " + error.message);
            } else {
                setResponseMessage("An unknown error occurred while sending message. Please try again.");
            }
        } finally {
            setLoading(false);
            setNextMessageId(nextMessageId + 1);
        }
    };


    useEffect(() => {
        fetchMessageHistory(messageHistoryEndpoint);
    }, []);
    
    if (loading) {
        return <div>Loading Messages...</div>;
    } 

    if (error) {
        return <div style={{color: 'red'}}> Error: {error} </div>;
    }

    return (
        <div className="chat-window">
            <div className="message-box">
                {
                    messages.map((msg) => (
                    <div key={msg.messageId} className={`message ${msg.sender}-message`}>
                    {msg.content}
                </div>
                ))}
            </div>
            <div className="chat-box">
                <input 
                    className="chat-input-box"
                    type="text"
                    placeholder="Type your message..."
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            handleSendMessage(sendMessageEndpoint, e.currentTarget.value);
                            e.currentTarget.value = ''; // Clear input
                        }
                    }}
                />
                <button id="send-message" onClick={() => {
                    const inputElement = document.querySelector('input');
                    if (inputElement) {
                        handleSendMessage(sendMessageEndpoint, inputElement.value);
                        inputElement.value = ''; // Clear input
                    }
                }}>Send</button>
            </div>
        </div>
    );
};

export default ChatWindow;