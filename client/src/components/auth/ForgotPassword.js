import React, { Component } from 'react';
import {NavLink} from 'react-router-dom';
import {Auth} from 'aws-amplify';
import FormErrors from '../FormErrors';
import Validate from '../utility/FormValidation';

class ForgotPassword extends Component {
  state = {
      email: '',
      errors: {
          cognito: null,
          blankfield: false
      }
  }

  clearErrorState = () => {
      this.setState({
          errors: {
              cognito: null,
              blankfield: false
          }
      });
  }

  forgotPasswordHandler = async event => {
      event.preventDefault();

      // Form validation
      this.clearErrorState();
      const error = Validate(event, this.state);
      if (error) {
          this.setState({
              errors: { ...this.state.errors, ...error }
          });
      }

      try {
          await Auth.forgotPassword(this.state.email);
          this.props.history.push('/forgotpasswordverification');
      } catch (error) {
          console.log(error);
      }


      // AWS Cognito integration here
  }

  onInputChange = event => {
      this.setState({
          [event.target.id]: event.target.value
      });
      document.getElementById(event.target.id).classList.remove("is-danger");
  }

  render() {
      return (
          <section className="section auth">
              <div className="container">
                  <div className="form-name">Forgot your password?</div>
                  <p>
            Please enter the email address associated with your account and we'll
            email you a password reset link.
                  </p>
                  <FormErrors formerrors={this.state.errors} />

                  <form className="auth-forms" onSubmit={this.forgotPasswordHandler}>
                      <div className="field">
                          <p className="control has-icons-left has-icons-right">
                              <input
                                  type="email"
                                  className="input"
                                  id="email"
                                  aria-describedby="emailHelp"
                                  placeholder="Enter email"
                                  value={this.state.email}
                                  onChange={this.onInputChange}
                              />
                              <span className="icon is-small is-left">
                                  <i className="fas fa-envelope"></i>
                              </span>
                          </p>
                      </div>
                      <div className="field">
                          <p className="control">
                              <NavLink to="/forgotpassword">Forgot password?</NavLink>
                          </p>
                      </div>
                      <div className="field">
                          <p className="control">
                              <button className="button is-primary">
                                Submit
                              </button>
                          </p>
                      </div>
                  </form>
              </div>
          </section>
      );
  }
}

export default ForgotPassword;