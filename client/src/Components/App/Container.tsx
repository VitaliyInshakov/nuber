import React from "react";
import { ThemeProvider } from "styled-components";
import { graphql } from "react-apollo";

import GlobalStyle from "../../global-styles";
import theme from "../../theme";

import Presenter from "./Presenter";
import { IS_LOGGED_IN } from "./Queries";

const Container = ({ data }: { data?: any;}) => (
    <ThemeProvider theme={theme}>
        <GlobalStyle />
        <Presenter isLoggedIn={data.auth.isLoggedIn}/>
    </ThemeProvider>
);

export default graphql(IS_LOGGED_IN)(Container);