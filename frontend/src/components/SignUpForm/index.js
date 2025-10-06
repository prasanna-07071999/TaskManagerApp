import { Component } from "react"
import { withRouter , Link} from "react-router-dom"
import "./index.css"

class SignUpForm extends Component {
  state = {
    username: "",
    email: "",
    password: "",
    showSubmitError: false,
    errorMsg: "",
  }

  onChangeUsername = (event) => {
    this.setState({ username: event.target.value })
  }

  onChangeEmail = (event) => {
    this.setState({ email: event.target.value })
  }

  onChangePassword = (event) => {
    this.setState({ password: event.target.value })
  }

  onSubmitSuccess = () => {
    const { history } = this.props
    alert("Sign Up Successful! Please Sign In.")
    history.replace("/signin")
  }

  onSubmitFailure = (errorMsg) => {
    this.setState({ showSubmitError: true, errorMsg })
  }

  submitForm = async (event) => {
    event.preventDefault()
    const { username, email, password } = this.state
    const userDetails = { username, email, password }
    const url = "https://taskmanagerapp-backend-xko3.onrender.com/signup"
    const options = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userDetails),
    }
    const response = await fetch(url, options)
    const data = await response.json()
    console.log(data)
    if (response.ok === true) {
      this.onSubmitSuccess()
    } else {
      this.onSubmitFailure(data)
    }
  }

  render() {
    const { username, email, password, showSubmitError, errorMsg } = this.state
    return (
      <div className="signup-app-container">
        <div className="bg-info sign-up-container">
          <h1 className="heading">Sign Up</h1>
          <form onSubmit={this.submitForm}>
            <label htmlFor="username" className="signup-user-name-label pb-2">Username</label>
            <br/>
            <input
              type="text"
              id="username"
              className="signup-input-field"
              value={username}
              onChange={this.onChangeUsername}
            />
            <br />

            <label htmlFor="email" className="signup-user-name-label pb-2">Email</label>
            <br />
            <input
              type="email"
              id="email"
              className="signup-input-field"
              value={email}
              onChange={this.onChangeEmail}
            />
            <br />

            <label htmlFor="password" className="signup-user-name-label pb-2">Password</label>
            <br />
            <input
              type="password"
              id="password"
              className="signup-input-field"
              value={password}
              onChange={this.onChangePassword}
            />
            <br />
            <div className="button-container">
                <button type="submit" className="btn btn-danger mt-4 text-light">Sign Up</button>
            </div>
            
            {showSubmitError && <p className="error-message">*{errorMsg}</p>}
          </form>
            <p className="text-dark">Already have an account? <Link to="/signin" className="text-primary">Sign In</Link></p>
        </div>
      </div>
    )
  }
}

export default withRouter(SignUpForm)
