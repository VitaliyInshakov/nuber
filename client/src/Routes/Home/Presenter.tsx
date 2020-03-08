import React from "react";
import Helmet from "react-helmet";
import Sidebar from "react-sidebar";
import styled from "styled-components";
import Menu from "../../Components/Menu";

const Container = styled.div``;

interface IProps {
    isMenuOpen: boolean;
    toggleMenu: () => void;
    loading: boolean;
}

const Presenter: React.FC<IProps> = ({
    isMenuOpen,
    toggleMenu,
    loading,
    }) => (
    <Container>
        <Helmet>
            <title>Home | Nuber</title>
        </Helmet>
        <Sidebar
            sidebar={<Menu/>}
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
            {!loading && <button onClick={toggleMenu}>Open sidebar</button>}
        </Sidebar>
    </Container>
);

export default Presenter;