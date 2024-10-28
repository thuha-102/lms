import { useContext } from 'react';
import { ChatbotContext } from '../contexts/chatbot-context';

export const useChatbot = () => useContext(ChatbotContext);
