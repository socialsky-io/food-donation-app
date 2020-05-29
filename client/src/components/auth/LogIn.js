import React, {Component} from 'react';
import FormErrors from '../FormErrors';
import Validate from '../utility/FormValidation';
import {Auth} from 'aws-amplify';
import CarouselItems from '../ImageCaruosel';

class LogIn extends Component {
  state = {
      username: '',
      password: '',
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
              errors: {...this.state.errors, ...error}
          });
      }


      const {username, password} = this.state;
      try {
          const signInResponse = await Auth.signIn(username, password);
          this.props.auth.setAuthStatus(true);
          this.props.auth.setUser(signInResponse);
          this.props.history.push('/app');
          console.log(signInResponse);

      } catch (error) {
          let err = null;
          !error.message ? err = {'message': error} : err = error;
          this.setState({
              errors: {
                  ...this.state.errors,
                  cognito: err
              }
          });
      }

      // AWS Cognito integration here
  };

  onInputChange = event => {
      this.setState({
          [event.target.id]: event.target.value
      });
      document.getElementById(event.target.id).classList.remove('is-danger');
  };

  render() {
      return (
          <section className="section auth">
              <div className="container">
                  <div className="form-name">Log in</div>
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
                          <p className="control has-icons-left">
                              <input
                                  className="input"
                                  type="password"
                                  id="password"
                                  placeholder="Password"
                                  value={this.state.password}
                                  onChange={this.onInputChange}
                              />
                              <span className="icon is-small is-left">
                                  <i className="fas fa-lock"></i>
                              </span>
                          </p>
                      </div>
                      <div className="field">
                          <p className="control">
                              <a href="/forgotpassword">Forgot password?</a>
                          </p>
                      </div>
                      <div className="field">
                          <p className="control">
                              <button className="button is-primary">
                                Login
                              </button>
                              <a href="/guestLogin" className="button is-primary back-game-btn">
                                Guest Login
                              </a>
                          </p>
                      </div>
                  </form>
              </div>

              <CarouselItems />
          </section>
      );
  }
}

export default LogIn;