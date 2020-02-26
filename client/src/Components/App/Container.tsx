import React from "react";
import { ThemeProvider } from "styled-components";
import { graphql } from "react-apollo";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";

import GlobalStyle from "../../global-styles";
import theme from "../../theme";

import Presenter from "./Presenter";
import { IS_LOGGED_IN } from "./Queries.local";

const Container = ({ data }: { data?: any;}) => (
    <>
        <ThemeProvider theme={theme}>
            <GlobalStyle />
            <Presenter isLoggedIn={data.auth.isLoggedIn}/>
        </ThemeProvider>
        <ToastContainer draggable={true} position={"bottom-center"}/>
    </>
);

export default graphql(IS_LOGGED_IN)(Container);