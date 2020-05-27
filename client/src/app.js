import React, {Component} from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import SubComponent from './components/subComponent/subComponent.Connect';

import Navbar from './components/Navbar';
import LogIn from './components/auth/LogIn';
import GuestUser from './components/auth/GuestUser';
import Register from './components/auth/Register';
import ForgotPassword from './components/auth/ForgotPassword';
import ForgotPasswordVerification from './components/auth/ForgotPasswordVerification';
import ChangePassword from './components/auth/ChangePassword';
import ChangePasswordConfirm from './components/auth/ChangePasswordConfirm';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import {Auth} from 'aws-amplify';
import classnames from 'classnames';

library.add(faEdit);

class App extends Component {

    state = {
        isAuthenticated: false,
        isAuthenticating: true,
        user: '',
        darkTheme: true
    }

    setAuthStatus = authenticated => {
        this.setState({isAuthenticated: authenticated});
    }

    setUser = user => {
        this.setState({user: user});
    }

    themeChange = darkTheme => {
        this.setState({darkTheme: !darkTheme});
    }

    async componentDidMount() {
        try {
            const session = await Auth.currentSession();
            this.setAuthStatus(true);
            const user = await Auth.currentAuthenticatedUser();
            this.setUser(user);
        } catch(err) {
            var guestUser = window.sessionStorage.getItem('guestUser');
            if(guestUser) {
                this.setAuthStatus(true);
                this.setUser({username: guestUser});
            }
            console.log(err);
        }
        this.setState({isAuthenticating: false});

    }

    render() {
        const authProps = {
            isAuthenticated: this.state.isAuthenticated,
            user: this.state.user,
            setAuthStatus: this.setAuthStatus,
            setUser: this.setUser
        };
        if(this.state.isAuthenticating) {
            return null;
        }
        const appClass = classnames({
            'App': true,
            'dark-theme': this.state.darkTheme
        });
        return (
            <div className={appClass}>
                <Router>
                    <div>
                        <Navbar auth={authProps} themeChange={this.themeChange} themetype={this.state.darkTheme} />
                        <Switch>
                            <Route exact path="/" render={(props) => <SubComponent {...props} auth={authProps} />} />
                            <Route exact path="/login" render={(props) => <LogIn {...props} auth={authProps} />} />
                            <Route exact path="/register" render={(props) => <Register {...props} auth={authProps} />} />
                            <Route exact path="/forgotpassword" render={(props) => <ForgotPassword {...props} auth={authProps} />} />
                            <Route exact path="/forgotpasswordverification" render={(props) => <ForgotPasswordVerification {...props} auth={authProps} />} />
                            <Route exact path="/changepassword" render={(props) => <ChangePassword {...props} auth={authProps} />}/>
                            <Route exact path="/changepasswordconfirmation" render={(props) => <ChangePasswordConfirm {...props} auth={authProps} />} />
                            <Route exact path="/app" render={(props) => <SubComponent {...props} auth={authProps} />} />
                            <Route exact path="/guestLogin" render={(props) => <GuestUser {...props} auth={authProps} />} />    
                        </Switch>
                    </div>
                </Router>
            </div>
        );
    }
}

export default App;
