import React from "react";
import Helmet from "react-helmet";
import Sidebar from "react-sidebar";
import styled from "styled-components";

const Container = styled.div``;

interface IProps {
    isMenuOpen: boolean;
    toggleMenu: () => void;
}

const Presenter: React.FC<IProps> = ({ isMenuOpen, toggleMenu }) => (
    <Container>
        <Helmet>
            <title>Home | Number</title>
        </Helmet>
        <Sidebar
            sidebar={<b>Sidebar content</b>}
            open={isMenuOpen}
            onSetOpen={toggleMenu}
            styles={{
                sidebar: {
                    backgroundColor: "white",
                    width: "80%",
                    zIndex: "10"
                }
            }}
        >
            <button onClick={toggleMenu}>Open sidebar</button>
        </Sidebar>
    </Container>
);

export default Presenter;