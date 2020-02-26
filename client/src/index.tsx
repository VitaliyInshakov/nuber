import React from "react";
import ReactDOM from "react-dom";
import { ApolloProvider } from "@apollo/react-hooks";

import client from "./apollo";

import App from "./Components/App";

ReactDOM.render(
    <ApolloProvider client={client}><App /></ApolloProvider>,
    document.getElementById("root"),
);
