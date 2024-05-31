import React, {useEffect, useState} from 'react';
import {Nav, NavItem} from 'reactstrap';
import {useNavigate, useParams} from 'react-router-dom';
import {useSelector, useDispatch} from 'react-redux';
import {
  selectConversation,
  setMessages, setConversations, pushConversations
} from '../../../store/apps/chat/ChatSlice';
import ChatListItem from './ChatListItem';
import user1 from '../../../assets/images/users/user1.jpg';
import user4 from '../../../assets/images/users/user4.jpg';
import {Loader} from "react-feather";
import ConversationService from "@/views/staff/chat/services/conversation.service.js";
import isEmpty from "lodash/isEmpty.js";
import MessageService from "@/views/staff/chat/services/message.service.js";

const ChatList = () => {
  const dispatch = useDispatch();
  const params = useParams();
  const navigate = useNavigate();
  const [pageNumber, setPageNumber] = useState(1); // Use state for page number

  async function getOrCreateConversation() {
    let employeeConversation = null;
    if (params.idUser) {
      employeeConversation = await ConversationService.getUserConversation(params.idOrganization, params.idUser);
      if (isEmpty(employeeConversation)) {
        employeeConversation = await ConversationService.createUserConversation(params.idOrganization, params.idUser, {});
      }
    }
    return employeeConversation;
  }

  async function loadNextConversations() {
    const nextConversations = await ConversationService.getAllConversations(params.idOrganization, pageNumber+1);
    dispatch(pushConversations(nextConversations));
    setPageNumber(pageNumber + 1);
  }

  useEffect(() => {
    dispatch(setConversations(null));
    dispatch(selectConversation(null));
    Promise.all([
      ConversationService.getAllConversations(params.idOrganization, pageNumber),
      getOrCreateConversation()
    ]).then(async (responses) => {
      let conversations = responses[0];
      let userConversation = responses[1];

      if (params.idUser && conversations && conversations.length > 0) {
        const messages = await MessageService.getMessages(params.idOrganization, userConversation.conversation_id);
        dispatch(setMessages(messages));
        conversations = conversations.filter((conversation) => conversation.conversation_id !== userConversation.conversation_id);
        conversations.unshift(userConversation);
        dispatch(setConversations(conversations));
        dispatch(selectConversation(userConversation))
      } else {
        dispatch(setConversations(conversations));
      }
    });
  }, [dispatch]);

  const filterChats = (chats, chatSearch) => {
    if (chats)
      return chats.filter((t) =>
        t.receiver.name.toLocaleLowerCase().includes(chatSearch.toLocaleLowerCase()),
      );
    return chats;
  };

  const chats = useSelector((state) =>
    filterChats(state.chatReducer.conversations, state.chatReducer.chatSearch),
  );
  const active = useSelector((state) => state.chatReducer.selectedConversation ? state.chatReducer.selectedConversation.conversation_id : null);
  return (
    chats ? (
      <Nav className="">
        {chats.map((chat) => (
          <ChatListItem
            key={chat.conversation_id}
            {...chat}
            active={active}
            onClick={
              async () => {
                dispatch(setMessages([]));
                const messages = await MessageService.getMessages(params.idOrganization, chat.conversation_id, 1);
                dispatch(setMessages(messages))
                dispatch(selectConversation(chat));
                navigate(`/organization/${params.idOrganization}/user/${chat.receiver_id}/conversation`)
              }
            }
            thumb={user4}
            status={chat.receiver.phone_number}
            contactName={chat.receiver.name}
            chatExcerpt='Employee'
          />
        ))}
        <NavItem onClick={loadNextConversations} className={`w-100 cursor-pointer`}>
          <div className="d-flex align-items-center p-3 mb-1">
            <div className="mx-3">
              <h5 className="mb-0">Load Next Conversations ...</h5>
            </div>
          </div>
        </NavItem>
      </Nav>
    ) : (
      <Loader></Loader>
    )

  );
};

export default ChatList;

