import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

import { Component } from 'react';
import {Switch, Route, Redirect} from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute';
import Cookie from 'js-cookie'
import AuthContext from './context/AuthContext';
import Header from './components/Header';
import SignUpForm from './components/SignUpForm'
import SignInForm from './components/SignInForm'
import HomePage from './components/HomePage'
import TaskList from './components/TaskList'
import TaskForm from './components/TaskForm'
import UserProfile from './components/UserProfile'
import Dashboard from './components/Dashboard';
import './App.css';

class App extends Component {

  state = {
    jwtToken : Cookie.get('jwt_token')
  }

  
  login = (token) => {
    Cookie.set('jwt_token', token, { expires: 30 });
    this.setState({ jwtToken: token });
  };

  logout = () => {
    Cookie.remove('jwt_token');
    this.setState({ jwtToken: null });
  };


  render(){
    const { jwtToken } = this.state;
    const isAuthenticated = !!jwtToken;
     return (
      <AuthContext.Provider
        value={{
          jwtToken,
          isAuthenticated,
          login: this.login,
          logout: this.logout,
        }}
      >
        <Header />
        <Switch>
          <Route exact path="/" component={HomePage} />
          <Route exact path="/signin" component={SignInForm} />
          <Route exact path="/signup" component={SignUpForm} />
          <ProtectedRoute exact path="/dashboard" component={Dashboard} />
          <ProtectedRoute exact path="/tasks" component={TaskList} />
          <ProtectedRoute exact path="/taskform" component={TaskForm} />
          <ProtectedRoute exact path="/profile" component={UserProfile} />
          <Redirect to="/" />
        </Switch>
      </AuthContext.Provider>
  )
  }
 
}
export default App;
