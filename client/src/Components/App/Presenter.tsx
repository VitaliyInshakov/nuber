import React from "react";

interface IProps {
    isLoggedIn: boolean;
}

const Presenter: React.FC<IProps> = ({ isLoggedIn }) => {
    return isLoggedIn
        ? <span>you sre in</span>
        : <span>you are out</span>;
};

export default Presenter;