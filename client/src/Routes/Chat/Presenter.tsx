import React from "react";
import Header from "../../Components/Header";
import styled from "styled-components";

const Container = styled.div``;

const Presenter: React.FC = () => (
    <Container>
        <Header title={"Chat"} />
    </Container>
);

export default Presenter;