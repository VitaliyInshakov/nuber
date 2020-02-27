import React from "react";
import {
    BrowserRouter,
    Redirect,
    Route,
    Switch,
} from "react-router-dom";

import AddPlace from "src/Routes/AddPlace";
import EditAccount from "src/Routes/EditAccount";
import FindAddress from "src/Routes/FindAddress";
import Home from "src/Routes/Home";
import Login from "src/Routes/Login";
import PhoneLogin from "src/Routes/PhoneLogin";
import Places from "src/Routes/Places";
import Ride from "src/Routes/Ride";
import Settings from "src/Routes/Settings";
import SocialLogin from "src/Routes/SocialLogin";
import VerifyPhone from "src/Routes/VerifyPhone";

interface IProps {
    isLoggedIn: boolean;
}

const Presenter: React.FC<IProps> = ({ isLoggedIn }) => (
    <BrowserRouter>
        {isLoggedIn ? <LoggedInRoutes/> : <LoggedOutRoutes/>}
    </BrowserRouter>
);

const LoggedOutRoutes: React.FC = () => (
    <Switch>
        <Route path="/" exact={true} component={Login} />
        <Route path="/phone-login" component={PhoneLogin} />
        <Route path="/verify-phone/" component={VerifyPhone} />
        <Route path="/social-login" component={SocialLogin} />
        <Redirect from="*" to="/" />
    </Switch>
);

const LoggedInRoutes: React.FC = () => (
    <Switch>
        <Route path="/" exact={true} component={Home} />
        <Route path="/ride/" exact={true} component={Ride} />
        <Route path="/edit-account" component={EditAccount} />
        <Route path="/settings" component={Settings} />
        <Route path="/places" component={Places} />
        <Route path="/add-place" component={AddPlace} />
        <Route path="/find-address" component={FindAddress} />
        <Redirect from="*" to="/" />
    </Switch>
);

export default Presenter;