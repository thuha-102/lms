import axios from 'axios';

const apiUrl = `${process.env.NEXT_PUBLIC_SERVER_API}/chatbot-ques`;

class CozeChatbotApi {
    createConversation() {
        return axios.post(
            process.env.NEXT_PUBLIC_COZE_CHATBOT_CREATE_CONVERSATION_URL, 
            {},
            {
                headers: {
                    'Authorization': `Bearer ${process.env.NEXT_PUBLIC_COZE_CHATBOT_API_KEY}`,
                    'Content-Type': 'application/json',
                },
            }
        );
    }

    async postMessage(userId, mess, conversationId) {
        await axios.post(apiUrl, {
            'question': mess
        });

        return axios.post(
            process.env.NEXT_PUBLIC_COZE_CHATBOT_SEND_MESSAGE_URL,
            {
                "bot_id": process.env.NEXT_PUBLIC_COZE_CHATBOT_ID,
                "user_id": toString(userId),
                "stream": true,
                "auto_save_history": true,
                "additional_messages": [
                    {
                        "role": "user",
                        "content": mess,
                        "content_type": "text"
            
                    }
                ]
            },
            {
                params: conversationId ? {
                    "conversation_id": conversationId
                } : {},
                headers: {
                    'Authorization': `Bearer ${process.env.NEXT_PUBLIC_COZE_CHATBOT_API_KEY}`,
                    'Content-Type': 'application/json',
                },
                responseType: 'stream'
            }
        )
    }

    GetCommonQues() {
        return axios.Get(
            `${apiUrl}/common-ques`, 
            {
                params: {
                    limit: 5
                }
            }
        );
    }
}

export const cozeChatbotApi = new CozeChatbotApi();
