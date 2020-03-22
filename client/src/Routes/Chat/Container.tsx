import React, { useState } from "react";
import { RouteComponentProps } from "react-router-dom";
import { useQuery, useMutation } from "@apollo/react-hooks";
import { SubscribeToMoreOptions } from "apollo-client";

import { USER_PROFILE } from "../../sharedQueries";
import {
    getChat,
    getChatVariables,
    userProfile,
    sendMessage,
    sendMessageVariables,
} from "../../types/api";

import Presenter from "./Presenter";
import { GET_CHAT, SEND_MESSAGE, SUBSCRIBE_TO_MESSAGES } from "./Queries";

interface IState {
    message: string;
}

const Container: React.FC<RouteComponentProps<any>> = (props) => {
    const [state, setState] = useState<IState>({
        message: "",
    });

    if (!props.match.params.chatId) {
        props.history.push("/");
    }

    const { data: userData } = useQuery<userProfile>(USER_PROFILE);
    const { data, loading, subscribeToMore } = useQuery<getChat, getChatVariables>(GET_CHAT);

    const subscribeToMoreOptions: SubscribeToMoreOptions = {
        document: SUBSCRIBE_TO_MESSAGES,
        updateQuery: (prev, { subscriptionData }) => {
            if (!subscriptionData.data) {
                return prev;
            }
            const newObject = Object.assign({}, prev, {
                GetChat: {
                    ...prev.GetChat,
                    chat: {
                        ...prev.GetChat.chat,
                        messages: [
                            ...prev.GetChat.chat.messages,
                            subscriptionData.data.MessageSubscription
                        ]
                    }
                }
            });
            return newObject;
        }
    };
    subscribeToMore(subscribeToMoreOptions);

    const [sendMessageFn] = useMutation<sendMessage, sendMessageVariables>(SEND_MESSAGE);

    const onInputChange: React.ChangeEventHandler<HTMLInputElement> = event => {
        const { target: { name, value } } = event;
        setState(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const onSubmit = (): void => {
        const { match: { params: { chatId } } } = props;
        if (state.message !== "") {
            setState({
                message: ""
            });
            sendMessageFn({
                variables: {
                    chatId,
                    text: state.message
                }
            });
        }
        return;
    };

    return <Presenter
        data={data}
        loading={loading}
        userData={userData}
        messageText={state.message}
        onInputChange={onInputChange}
        onSubmit={onSubmit}
    />;
};

export default Container;