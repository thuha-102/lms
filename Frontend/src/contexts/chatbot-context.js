import { createContext, useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';

const STORAGE_KEY = 'app.chatbot';

const storage = globalThis.localStorage;

const restoreChatbot = () => {
  let value = null;

  try {
    const restored = storage.getItem(STORAGE_KEY);

    if (restored) {
      value = JSON.parse(restored);
    }
  } catch (err) {
    console.error(err);
    // If stored data is not a strigified JSON this will fail,
    // that's why we catch the error
  }

  return value;
};

const storeChatbot = (value) => {
  storage.setItem(STORAGE_KEY, JSON.stringify(value));
};

const initialChatbot = {
  conversationId: '',
  chatContent: [],
  recommendQues: ["Xin chào", "Tài liệu AI", "Ngủ quên", "Học hiệu quả", "Mệt v~"],
};

const initialState = {
  ...initialChatbot,
  isInitialized: false,
  openDrawer: false
};

export const ChatbotContext = createContext({
  ...initialState,
  handleDrawerClose: () => { },
  handleDrawerOpen: () => { },
  handleUpdate: () => { }
});

export const ChatbotProvider = (props) => {
  const { children } = props;
  const [state, setState] = useState(initialState);

  useEffect(() => {
    const restored = restoreChatbot();

    if (restored) {
      setState((prevState) => ({
        ...prevState,
        ...restored,
        isInitialized: true
      }));
    }
  }, []);

  const handleUpdate = useCallback((chatbotInfo) => {
    setState((prevState) => {
      storeChatbot({
        conversationId: prevState.conversationId,
        chatContent: prevState.chatContent,
        recommendQues: prevState.recommendQues,
        ...chatbotInfo
      });

      return {
        ...prevState,
        ...chatbotInfo
      };
    });
  }, []);

  const handleDrawerOpen = useCallback(() => {
    setState((prevState) => ({
      ...prevState,
      openDrawer: true
    }));
  }, []);

  const handleDrawerClose = useCallback(() => {
    setState((prevState) => ({
      ...prevState,
      openDrawer: false
    }));
  }, []);

  return (
    <ChatbotContext.Provider
      value={{
        ...state,
        handleDrawerClose,
        handleDrawerOpen,
        handleUpdate
      }}
    >
      {children}
    </ChatbotContext.Provider>
  );
};

ChatbotProvider.propTypes = {
  children: PropTypes.node.isRequired
};

export const ChatbotConsumer = ChatbotContext.Consumer;
