import {Card, CardBody} from 'reactstrap';

import TwoColumn from '../../../components/twoColumn/TwoColumn';
import ChatSearch from "./ChatSearch.js";
import ChatList from "./ChatList.js";
import ChatContent from "./ChatContent.js";
import ChatMsgForm from "./ChatMsgForm.js";
import {useParams} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {useEffect} from "react";
import ConversationService from "@/views/staff/chat/services/conversation.service.js";
import {Loader} from "react-feather";
import {selectConversation} from "@/store/apps/chat/ChatSlice.js";
import isEmpty from 'lodash/isEmpty';

const Chat = () => {

    return (
        <Card>
            <CardBody>
                <TwoColumn
                    leftContent={
                        <>
                            <ChatSearch/>
                            <ChatList/>
                        </>
                    }
                    rightContent={
                        <>
                            <ChatContent/>
                            <ChatMsgForm/>
                        </>
                    }
                />
            </CardBody>
        </Card>
    );
};

export default Chat;
