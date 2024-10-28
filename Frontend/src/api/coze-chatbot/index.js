import axios from 'axios';
import { deepCopy } from '../../utils/deep-copy';

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
        /*return Promise.resolve(deepCopy({
            "code": 0,
            "data": {
                "created_at": 1728566512,
                "id": "7424135095868620818",
                "meta_data": {}
            },
            "msg": ""
        }));*/
    }

    postMessage(userId, mess, conversationId) {
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

    getMessages(conversationId) {
        return axios.post(
            process.env.NEXT_PUBLIC_COZE_CHATBOT_SHOW_MESSAGES_URL,
            {
                "order": "asc"
            },
            {
                params: {
                    "conversation_id": conversationId
                },
                headers: {
                    'Authorization': `Bearer ${process.env.NEXT_PUBLIC_COZE_CHATBOT_API_KEY}`,
                    'Content-Type': 'application/json',
                },
            }
        );

        /*return Promise.resolve(deepCopy({
            "code": 0,
            "data": [
            {
                "bot_id": "",
                "chat_id": "",
                "content": "What day is it today",
                "content_type": "text",
                "conversation_id": "7423716775952547847",
                "created_at": 1728469807,
                "id": "7423719446172237842",
                "meta_data": {},
                "role": "user",
                "type": "question",
                "updated_at": 1728469807
            },
            {
                "bot_id": "7423708156121481224",
                "chat_id": "7423721123608772616",
                "content": "Today is Wednesday. How can I assist you with your studies?",
                "content_type": "text",
                "conversation_id": "7423716775952547847",
                "created_at": 1728469808,
                "id": "7423721123608821768",
                "meta_data": {},
                "role": "assistant",
                "type": "answer",
                "updated_at": 1728469808
            },
            {
                "bot_id": "",
                "chat_id": "",
                "content": "What day is it today",
                "content_type": "text",
                "conversation_id": "7423716775952547847",
                "created_at": 1728470042,
                "id": "7423719821201833992",
                "meta_data": {},
                "role": "user",
                "type": "question",
                "updated_at": 1728470042
            },
            {
                "bot_id": "7423708156121481224",
                "chat_id": "7423722073517719560",
                "content": "Today is Wednesday. Anything specific you need help with?",
                "content_type": "text",
                "conversation_id": "7423716775952547847",
                "created_at": 1728470043,
                "id": "7423722073517768712",
                "meta_data": {},
                "role": "assistant",
                "type": "answer",
                "updated_at": 1728470043
            },
            {
                "bot_id": "",
                "chat_id": "",
                "content": "What day is it today",
                "content_type": "text",
                "conversation_id": "7423716775952547847",
                "created_at": 1728470127,
                "id": "7423719824678993927",
                "meta_data": {},
                "role": "user",
                "type": "question",
                "updated_at": 1728470127
            },
            {
                "bot_id": "7423708156121481224",
                "chat_id": "7423722472521973768",
                "content": "It's Wednesday today. How can I help you with your coursework or any other queries?",
                "content_type": "text",
                "conversation_id": "7423716775952547847",
                "created_at": 1728470128,
                "id": "7423722472521990152",
                "meta_data": {},
                "role": "assistant",
                "type": "answer",
                "updated_at": 1728470128
            },
            {
                "bot_id": "",
                "chat_id": "",
                "content": "What day is it today",
                "content_type": "text",
                "conversation_id": "7423716775952547847",
                "created_at": 1728470411,
                "id": "7423721467680014343",
                "meta_data": {},
                "role": "user",
                "type": "question",
                "updated_at": 1728470411
            },
            {
                "bot_id": "7423708156121481224",
                "chat_id": "7423723735846256647",
                "content": "Today is Wednesday. How can I assist you further?",
                "content_type": "text",
                "conversation_id": "7423716775952547847",
                "created_at": 1728470411,
                "id": "7423723735846273031",
                "meta_data": {},
                "role": "assistant",
                "type": "answer",
                "updated_at": 1728470411
            },
            {
                "bot_id": "",
                "chat_id": "",
                "content": "hello",
                "content_type": "text",
                "conversation_id": "7423716775952547847",
                "created_at": 1728470493,
                "id": "7423721467680063495",
                "meta_data": {},
                "role": "user",
                "type": "question",
                "updated_at": 1728470493
            },
            {
                "bot_id": "7423708156121481224",
                "chat_id": "7423724141293010951",
                "content": "Hi there! How can I assist you today?",
                "content_type": "text",
                "conversation_id": "7423716775952547847",
                "created_at": 1728470494,
                "id": "7423724141293060103",
                "meta_data": {},
                "role": "assistant",
                "type": "answer",
                "updated_at": 1728470494
            }
            ],
            "first_id": "7423719446172237842",
            "has_more": false,
            "last_id": "7423724141293060103",
            "msg": ""
        }));*/
    }
}

export const cozeChatbotApi = new CozeChatbotApi();
