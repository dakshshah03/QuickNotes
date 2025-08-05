
interface Message {
    id: string;
    sender: 'user' | 'llm';
    content: string;
    isCurrentUser: boolean;
}

// list of messages
interface MessageWindow {
    messages: Message[];
}



