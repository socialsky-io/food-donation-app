import React, { Component } from 'react';
import {Auth} from 'aws-amplify';
import {NavLink} from 'react-router-dom';
import FormErrors from '../FormErrors';
import Validate from '../utility/FormValidation';

class ChangePassword extends Component {
  state = {
      oldpassword: '',
      newpassword: '',
      confirmpassword: '',
      errors: {
          cognito: null,
          blankfield: false,
          passwordmatch: false
      }
  }

  clearErrorState = () => {
      this.setState({
          errors: {
              cognito: null,
              blankfield: false,
              passwordmatch: false
          }
      });
  }

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

      try {
          if(this.props.auth.user) {
              await Auth.changePassword(this.props.auth.user, this.state.oldpassword, this.state.newpassword);
              this.props.history.push('/changepasswordconfirmation');
          }
      } catch (error) {
          console.log(error);
      }

      // AWS Cognito integration here
  };

  onInputChange = event => {
      this.setState({
          [event.target.id]: event.target.value
      });
      document.getElementById(event.target.id).classList.remove('is-danger');
  }

  render() {
      return (
          <section className="section auth">
              <div className="container">
                  <div className="form-name">Change Password</div>
                  <FormErrors formerrors={this.state.errors} />

                  <form className="auth-forms" onSubmit={this.handleSubmit}>
                      <div className="field">
                          <p className="control has-icons-left">
                              <input 
                                  className="input" 
                                  type="password"
                                  id="oldpassword"
                                  placeholder="Old password"
                                  value={this.state.oldpassword}
                                  onChange={this.onInputChange}
                              />
                              <span className="icon is-small is-left">
                                  <i className="fas fa-lock"></i>
                              </span>
                          </p>
                      </div>
                      <div className="field">
                          <p className="control has-icons-left">
                              <input
                                  className="input"
                                  type="password"
                                  id="newpassword"
                                  placeholder="New password"
                                  value={this.state.newpassword}
                                  onChange={this.onInputChange}
                              />
                              <span className="icon is-small is-left">
                                  <i className="fas fa-lock"></i>
                              </span>
                          </p>
                      </div>
                      <div className="field">
                          <p className="control has-icons-left">
                              <input
                                  className="input"
                                  type="password"
                                  id="confirmpassword"
                                  placeholder="Confirm password"
                                  value={this.state.confirmpassword}
                                  onChange={this.onInputChange}
                              />
                              <span className="icon is-small is-left">
                                  <i className="fas fa-lock"></i>
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
                                Change password
                              </button>
                          </p>
                      </div>
                  </form>
              </div>
          </section>
      );
  }
}

export default ChangePassword;