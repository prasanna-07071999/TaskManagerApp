import {Component} from 'react';
import { withRouter } from 'react-router-dom';
import Cookie from 'js-cookie';
import './index.css'
class Header extends Component {

  handleNavigation = (path) => {
    const token = Cookie.get('jwt_token');
    const {history} = this.props
    if (!token) {
      history.push('/signin');
    } else {
      history.push(path);
    }
  };

  handleLogout = () => {
    Cookie.remove('jwt_token');
    const {history} = this.props
    history.push('/');
  };

  onClickHomePage = () => {
    const  {history} = this.props
    history.replace('/')
  }

  onClickSignIn = () => {
    const  {history} = this.props
    history.replace('/signin')
  }
  onClickSignUp = () => {
    const  {history} = this.props
    history.replace('/signup')
  }

  onClickTaskList = () => {
    this.handleNavigation('./tasks')
  }

  onClickTaskForm = () => {
    this.handleNavigation('/taskform')
  }

  onClickUserProfile = () => {
    this.handleNavigation('/profile')
  }

  onClickDashboard = () => {
    this.handleNavigation('/dashboard')
  }

  render() {
    const jwttoken = Cookie.get('jwt_token');
    return (
      <nav className="navbar bg-primary p-3 d-flex flex-row justify-content-between">
        <h1 className="navbar-logo" onClick={this.onClickHomePage}>
          MyTaskApp
        </h1>
        <div>
          {!jwttoken ? (
            <>
              <button className="btn btn-dark m-2" onClick={this.onClickSignUp}>
                Sign Up
              </button>
              <button className="btn btn-dark m-2" onClick={this.onClickSignIn}>
                Login
              </button>
              <button className="btn btn-dark m-2" onClick={this.onClickSignIn}>
                Task List
              </button>
              <button className="btn btn-dark m-2" onClick={this.onClickSignIn}>
                Task Form
              </button>
              <button className="btn btn-dark m-2" onClick={this.onClickSignIn}>
                User Profile
              </button>
            </>
          ) : (
            <>
              <button className="btn btn-warning m-2" onClick={this.onClickDashboard}>
                Dashboard
              </button>
              <button className="btn btn-warning m-2" onClick={this.onClickTaskList}>
                Task List
              </button>
              <button className="btn btn-warning m-2" onClick={this.onClickTaskForm}>
                Task Form
              </button>
              <button className="btn btn-warning m-2" onClick={this.onClickUserProfile}>
                User Profile
              </button>
              <button className="btn btn-danger m-2" onClick={this.handleLogout}>
                Logout
              </button>
            </>
          )}
        </div>
      </nav>
    );
  }
}

export default withRouter(Header);
