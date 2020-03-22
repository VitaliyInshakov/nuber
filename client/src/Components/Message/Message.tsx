import React from "react";
import styled from "styled-components";

const Container = styled("div")<{mine: boolean;}>``;

interface IProps {
    text: string;
    mine: boolean;
}

const Message: React.FC<IProps> = ({ text, mine }) => (
    <Container mine={mine}>{text}</Container>
);

export default Message;