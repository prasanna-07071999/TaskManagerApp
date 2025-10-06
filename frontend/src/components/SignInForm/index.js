import { Component } from "react"
import { withRouter, Link} from "react-router-dom"
import Cookie from 'js-cookie'
import "./index.css"

class SignInForm extends Component {
  state = {
    email: "",
    password: "",
    showSubmitError: false,
    errorMsg: "",
  }

  onChangeEmail = event => {
    this.setState({ email: event.target.value })
  }

  onChangePassword = event => {
    this.setState({ password: event.target.value })
  }

  onSubmitSuccess = jwtToken => {
    const { history } = this.props
    Cookie.set('jwt_token', jwtToken, { expires: 30 });
    history.replace("/dashboard")
  }

  onSubmitFailure = (errorMsg) => {
    this.setState({ showSubmitError: true, errorMsg })
  }

  submitForm = async event => {
    event.preventDefault()
    const {email, password } = this.state
    const userDetails = {email, password }
    const url = "https://taskmanagerapp-backend-xko3.onrender.com/signin"
    const options = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userDetails),
    }
    const response = await fetch(url, options)
    const data = await response.json()
    if (response.ok === true) {
      this.onSubmitSuccess(data.jwtToken)
    } else {
      this.onSubmitFailure(data.error_msg)
    }
  }

  render() {
    const { email, password, showSubmitError, errorMsg } = this.state
    return (
      <div className="signin-app-container">
          <div className="sign-in-container bg-info">
            <h1 className="signin-heading text-dark text-center">Login</h1>
            <form onSubmit={this.submitForm}>
              <label className="signin-user-name-label">Email</label>
              <br />
              <input
                type="email"
                className="signin-input-field"
                value={email}
                onChange={this.onChangeEmail}
              />
              <br />
              <label className="signin-user-name-label">Password</label>
              <br />
              <input
                type="password"
                className="signin-input-field"
                value={password}
                onChange={this.onChangePassword}
              />
              <br/>
              <div className="button-container">
                <button type="submit" className="btn btn-danger mt-4">Login</button>
              </div>

              {showSubmitError && <p className="error-message">{errorMsg}</p>}
            </form>
            <p className="text-light">Don't have an account? <Link to="/signup">Sign up</Link></p>
        </div>
      </div>
    )
  }
}

export default withRouter(SignInForm)
