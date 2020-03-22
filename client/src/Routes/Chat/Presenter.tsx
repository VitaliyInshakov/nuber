import React from "react";
import styled from "styled-components";

import Header from "../../Components/Header";
import Message from "../../Components/Message";
import { getChat, userProfile } from "../../types/api";

const Container = styled.div``;

interface IProps {
    data?: getChat;
    userData?: userProfile;
    loading: boolean;
}

const Presenter: React.FC<IProps> = ({
    loading,
    data: { GetChat: { chat = null } = {} } = {},
    userData: { GetMyProfile: { user = null } = {} } = {}
}) => (
    <Container>
        <Header title={"Chat"} />
        {!loading &&
        chat &&
        user && (
            <>
                {chat.messages &&
                chat.messages.map(message => {
                    if (message) {
                        return (
                            <Message
                                key={message.id}
                                text={message.text}
                                mine={user.id === message.userId}
                            />
                        );
                    }
                    return null;
                })}
            </>
        )}
    </Container>
);

export default Presenter;