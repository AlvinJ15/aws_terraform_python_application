import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Button, Spinner} from 'reactstrap';
import SimpleBar from 'simplebar-react';
import user4 from '../../../assets/images/users/user4.jpg';
import {useParams} from "react-router-dom";
import moment from "moment";
import ConversationService from "@/views/staff/chat/services/conversation.service.js";
import {pushMessages, setMessages} from "@/store/apps/chat/ChatSlice.js";
import MessageService from "@/views/staff/chat/services/message.service.js";

const ChatContent = () => {
  const dispatch = useDispatch();
  const params = useParams();
  const conversation = useSelector((state) => state.chatReducer.selectedConversation);
  const [pageNumber, setPageNumber] = useState(1); // Use state for page number

  const chatMessages = useSelector(
    (state) => state.chatReducer.chatMessages,
  );

  async function loadNextMessages() {
    const nextMessages = await MessageService.getMessages(params.idOrganization, conversation.conversation_id, pageNumber + 1)
    dispatch(pushMessages(nextMessages));
    setPageNumber(pageNumber + 1);
  }

  useEffect(() => {
    setPageNumber(1);
  }, [params]);

  return (
    <>
      {(chatMessages && conversation) ? (
        <div>
          <div className="d-flex align-items-center p-3 border-bottom">
            <span className='d-xs-block d-lg-none '><Button close className="me-2" /></span>
            <div className="">
              <img src={user4} alt="user" className="rounded-circle" width="46" />
            </div>
            <div className="mx-2">
              <h5 className="mb-0">{conversation.receiver.name}</h5>
              <small>{conversation.receiver.phone_number}</small>
            </div>
          </div>

          <SimpleBar style={{ height: 'calc(100vh - 360px)' }}>
            <ul className="list-unstyled p-4">
              {
                chatMessages && chatMessages.length ? (
                <li className="md-12" key="load_more">
                  <Button className="btn" color="secondary" size="lg" block onClick={loadNextMessages}>
                    Load More Messages ...
                  </Button>
                </li>) : ''
              }
              {chatMessages.map((message) =>
                message.receiver_id !== params.idUser ? (
                  <li className="chat-item d-flex align-items-center" key={message.message_id}>
                    <div>
                      <img
                        src={user4}
                        alt={chatMessages.name}
                        width="50"
                        className="rounded-circle"
                      />
                    </div>
                    <div className="px-3">
                      <small>{moment(message.created_at).format("MMMM Do, YYYY h:mm A")}</small>
                      <div className="d-table p-2 mb-1 bg-light" key={message.message_id}>
                        {message.content}
                      </div>
                    </div>
                  </li>
                ) : (
                  <div key={message.message_id}>
                    <li className="flex-row-reverse text-end d-flex my-1 ms-auto primary" key={message.message_id}>
                      <div>
                        <small>{message.sender ? message.sender.name : ''} - {moment(message.created_at).format("MMMM Do, YYYY h:mm A")}</small>
                        <div key={message.message_id} className="bg-primary text-dark-white p-2 d-table ms-auto  mb-1">
                          {message.content}
                        </div>
                      </div>
                    </li>
                  </div>
                ),
              )}
            </ul>
          </SimpleBar>
        </div>
      ) : (
        <Spinner style={{width: '3rem', height: '3rem'}} type="grow"/>
      )}
    </>
  );
};

export default ChatContent;
