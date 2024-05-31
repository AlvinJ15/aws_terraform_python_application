import { createSlice } from '@reduxjs/toolkit';
import MessageService from "@/views/staff/chat/services/message.service.js";


const initialState = {
  conversations: [],
  selectedConversation: null,
  chatSearch: '',
  chatMessages: null
};

export const ChatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setConversations: (state, action) => {
      state.conversations = action.payload;
    },
    pushConversation: (state, action) => {
      state.conversations.push(action.payload);
    },
    pushConversations: (state, action) => {
      state.conversations = state.conversations.concat(action.payload);
    },
    SearchChat: (state, action) => {
      state.chatSearch = action.payload;
    },
    selectConversation: (state, action) => {
      state.selectedConversation = action.payload;
    },
    setMessages: (state, action) => {
      state.chatMessages = action.payload.reverse();
    },
    pushMessages: (state, action) => {
      state.chatMessages = action.payload.reverse().concat(state.chatMessages);
    },
    sendMsg: {
      reducer: (state, action) => {
        state.chatMessages.push(action.payload)
      },

      prepare: (chatMsg) => {
        return {
          payload: chatMsg,
        };
      },
    },
  },
});

export const {
  SearchChat,
  setConversations,
  pushConversation,
  pushConversations,
  setMessages,
  pushMessages,
  sendMsg,
  selectConversation
} = ChatSlice.actions;

export const sendMessage = (organizationId, conversationId, fromUserId, toUserId, chatMsg) => async (dispatch) => {
  try {
    let msgContent = {
      sender_id: fromUserId,
      receiver_id: toUserId,
      content: chatMsg,
      conversation_id: conversationId,
    }
    const response = await MessageService.createMessage(organizationId, conversationId, msgContent)
    dispatch(sendMsg(response));
  } catch (err) {
    throw new Error(err)
  }
}

export default ChatSlice.reducer;
