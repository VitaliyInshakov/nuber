import React from "react";
import styled from "styled-components";

const Container = styled("div")<{mine: boolean;}>`
  background-color: ${props =>
    props.mine ? props.theme.blueColor : props.theme.greyColor};
  color: white;
  padding: 10px 20px;
  border-radius: 20px;
  align-self: ${props => (props.mine ? "flex-end" : "flex-start")};
  border-bottom-right-radius: ${props => (props.mine ? "0px" : "20px")};
  border-bottom-left-radius: ${props => (!props.mine ? "0px" : "20px")};
`;

interface IProps {
    text: string;
    mine: boolean;
}

const Message: React.FC<IProps> = ({ text, mine }) => (
    <Container mine={mine}>{text}</Container>
);

export default Message;