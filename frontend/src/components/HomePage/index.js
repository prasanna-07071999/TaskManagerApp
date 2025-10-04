// src/components/Home/index.js

import React from 'react'
import { withRouter } from 'react-router-dom'
import Cookie from 'js-cookie'
import './index.css'

class Home extends React.Component {
  handleProtectedNavigation = (path) => {
    const token = Cookie.get('jwt_token');
    if (!token) {
      this.props.history.push('/signin');
    } else {
      this.props.history.push(path);
    }
  }

  render() {
    return ( 
      <div className='container'>
        <div className='row'></div>
          <div className='col-12'>
            <div className="homepage-info d-flex flex-row justify-content-between">
            <div className='col-lg-6 d-flex flex-column justify-content-center text-start'>
              <h1 className='home-page-heading'>Task Management</h1>
              <p className="homepage-description">
                Manage your daily tasks efficiently with ease. Create, update, and track your tasks seamlessly across devices.
              </p>
              <p className='homepage-text'>
                Sign up or log in to explore powerful task management features designed for your productivity.
              </p>
            </div>
            <div className='col-lg-6 d-flex flex-column justify-content-center'>
              <img
                src="https://res.cloudinary.com/dgdoej1q8/image/upload/v1759544711/images_i3ifsh.jpg"
                alt="Task Management Illustration"
                className="home-page-image m-4"
              />
            </div>
          </div>
          </div>
      </div> 
          
    )
  }
}

export default withRouter(Home);
