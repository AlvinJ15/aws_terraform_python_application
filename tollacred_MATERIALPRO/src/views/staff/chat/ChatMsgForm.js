import React, {useState} from 'react';
import {Form, Input, Button} from 'reactstrap';
import {useSelector, useDispatch} from 'react-redux';
import {sendMessage, sendMsg} from '../../../store/apps/chat/ChatSlice';
import {useParams} from "react-router-dom";
import AuthManager, {getApiToken} from "@/config/AuthManager.js";

const ChatMsgForm = () => {
    const [msg, setMsg] = useState('');
    const dispatch = useDispatch();
    const params = useParams();

    const handleChatMsgChange = (e) => {
        setMsg(e.target.value);
    };
    const conversationId = useSelector((state) => state.chatReducer.selectedConversation ? state.chatReducer.selectedConversation.conversation_id : null);

    const chatMessages = useSelector(
        (state) => state.chatReducer.chatMessages,
    );
    const onChatMsgSubmit = (e) => {
        e.preventDefault();
        e.stopPropagation();
        let currentAdminId = AuthManager.getUserId();
        dispatch(sendMessage(params.idOrganization, conversationId, currentAdminId, params.idUser, msg));
        setMsg('');
    };

    return (
        chatMessages ?
            <Form onSubmit={onChatMsgSubmit.bind()} className="card-body border-top">
                <div className="d-flex">
                    <Input
                        type="text"
                        className="form-control me-2"
                        placeholder="Type your message"
                        onChange={handleChatMsgChange.bind(null)}
                        value={msg}
                        required
                    />
                    <Button
                        onClick={() => {
                            dispatch(sendMessage(params.idOrganization, conversationId, AuthManager.getUserId(), params.idUser, msg));
                            setMsg('');
                        }}
                        color="primary"
                        disabled={!msg}
                    >
                        <i className="bi bi-send"/>
                    </Button>
                </div>
            </Form>
            :
            <div></div>
    );
};

export default ChatMsgForm;
