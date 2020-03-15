import React from "react";
import styled from "styled-components";

const Presenter = styled.div`
  margin: 15px 0;
  display: flex;
  align-items: center;
  & i {
    font-size: 12px;
  }
`;

const Container = styled.div`
  margin-left: 10px;
`;

const Name = styled.span`
  display: block;
`;

const Icon = styled.span`
  cursor: pointer;
`;

const Address = styled.span`
  color: ${props => props.theme.greyColor};
  font-size: 14px;
`;

interface IProps {
    fav: boolean;
    name: string;
    address: string;
    onStartPress: any;
}

const PlacePresenter: React.FC<IProps> = ({
    fav,
    name,
    address,
    onStartPress,
}) => (
    <Presenter>
        <Icon onClick={onStartPress}>{fav ? "★" : "✩"}</Icon>
        <Container>
            <Name>{name}</Name>
            <Address>{address}</Address>
        </Container>
    </Presenter>
);

export default PlacePresenter;