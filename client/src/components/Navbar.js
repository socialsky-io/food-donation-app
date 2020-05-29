import React, { Component, Fragment } from 'react'
import {Auth} from 'aws-amplify';
import { Switch } from 'antd';

export default class Navbar extends Component {

    handleLogout = async (event) => {
        event.preventDefault();
        try {
            Auth.signOut();
            this.props.auth.setAuthStatus(false);
            this.props.auth.setUser('');
            window.sessionStorage.removeItem('guestUser');
        } catch(err) {
            console.log(err.message);
        }
    }

    render() {
        const {auth = {}} = this.props; 
        const {isAuthenticated, user = {}} = auth;
        return (
            <nav className="navbar" role="navigation" aria-label="main navigation">
                <div id="navbarBasicExample" className="navbar-menu"> 
                    <div className="navbar-start">
                        <div className="feed-need-logo"></div>
                    </div>
                    <div className="navbar-end">
                        <div className="navbar-item">
                            {/* <Switch className="theme-switch" checkedChildren="Light" unCheckedChildren="Dark" onChange={this.props.themeChange} value={this.props.darkTheme}/> */}
                            {isAuthenticated && user && (
                                <div className="user-welcome-text">Hello <b>{user.username}</b></div>
                            )}
                            <div className="buttons">
                                {isAuthenticated && user && (
                                    <a href="/" onClick={this.handleLogout} className="button is-light log-out-btn">
                                        Log out
                                    </a>
                                )}
                                {!isAuthenticated && !user && (
                                    <Fragment>
                                        <a href="/register" className="button is-primary">
                                            Register
                                        </a>
                                        <a href="/login" className="button is-light">
                                            Log in
                                        </a>
                                    </Fragment>
                                )}                          
                            </div>
                        </div>
                    </div>
                </div>
            </nav>
        )
    }
}
