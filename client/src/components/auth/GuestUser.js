import React, { Component } from 'react';
import FormErrors from "../FormErrors";
import Validate from "../utility/FormValidation";
import {Auth} from 'aws-amplify';

class GuestUser extends Component {
  state = {
      username: "",
      errors: {
          cognito: null,
          blankfield: false
      }
  };

  clearErrorState = () => {
      this.setState({
          errors: {
              cognito: null,
              blankfield: false
          }
      });
  };

  handleSubmit = async event => {
      event.preventDefault();

      // Form validation
      this.clearErrorState();
      const error = Validate(event, this.state);
      if (error) {
          this.setState({
              errors: { ...this.state.errors, ...error }
          });
      }
      const {username} = this.state;
      window.sessionStorage.setItem('guestUser', username);

      this.props.auth.setAuthStatus(true);
      this.props.auth.setUser({username: this.state.username});
      this.props.history.push('/app');
  };

  onInputChange = event => {
      this.setState({
          [event.target.id]: event.target.value
      });
      document.getElementById(event.target.id).classList.remove("is-danger");
  };

  render() {
      return (
          <section className="section auth">
              <div className="container">
                  <div className="form-name">Guest User</div>
                  <FormErrors formerrors={this.state.errors} />

                  <form className="auth-forms" onSubmit={this.handleSubmit}>
                      <div className="field">
                          <p className="control">
                              <input 
                                  className="input" 
                                  type="text"
                                  id="username"
                                  aria-describedby="usernameHelp"
                                  placeholder="Enter username or email"
                                  value={this.state.username}
                                  onChange={this.onInputChange}
                              />
                          </p>
                      </div>
                      <div className="field">
                          <p className="control">
                              <button className="button is-primary">
                                Guest Login
                              </button>
                          </p>
                      </div>
                  </form>
              </div>
          </section>
      );
  }
}

export default GuestUser;