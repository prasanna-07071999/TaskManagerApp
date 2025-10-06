import React, { Component } from 'react';
import Cookie from 'js-cookie';

class UserProfile extends Component {
  state = {
    username: '',
    email: '',
    loading: true,
    error: null,
  };

  componentDidMount() {
    this.getUserProfile()
  }

  getUserProfile = async () => {
    const jwtToken = Cookie.get('jwt_token');
    const apiUrl = 'https://taskmanagerapp-backend-xko3.onrender.com/profile'
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
    if (response.ok === true){
      const fetchedData = await response.json()
      this.setState({
          username: fetchedData.username,
          email: fetchedData.email,
          loading: false,
          error: null,
          createdAt: fetchedData.created_at,
        })
    }
  }

  handleUsername = event => {
    this.setState({ username: event.target.value});
  };
  handleEmail = event => {
    this.setState({ email: event.target.value});
  };

  handleSubmit = async event => {
    event.preventDefault();
    const { username, email, createdAt } = this.state;
    const jwttoken = Cookie.get('jwt_token');
    const userDetails = {username, email, createdAt}
    this.setState({ loading: true, message: '', error: null });
    const url = 'https://taskmanagerapp-th5h.onrender.com/profile'
    const options = {
      method: 'PUT',
      body: JSON.stringify(userDetails),
      headers: {
        Authorization: `Bearer ${jwttoken}`,
        'Content-Type': 'application/json',
      },    
    } 
    const response = await fetch(url, options)
    console.log(response)
    const data = await response.json()
    if (response.ok === true) {
    this.onSubmitSuccess(data.jwt_token);
  } else {
    this.onSubmitFailure(data.error_msg);
  }
} 

  render() {
    const { username, email, createdAt, loading, error, message } = this.state;
    if (loading) return <div className="container mt-4">Loading profile...</div>;

    return (
      <div className="container mt-4">
        <div>
          <p className='profile-name'><span className='fw-bold'>Name:</span> {username}</p>
          <p className='profile-email'><span className='fw-bold'>Email:</span>{email}</p>
          <p><span className='fw-bold'>Time of Creation:</span> {createdAt}</p>
        </div>
        <h1>User Profile</h1>
        {message && <div className="alert alert-success">{message}</div>}
        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={this.handleSubmit}>
          <div className="mb-3">
            <label htmlFor="username" className="form-label">
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              className="form-control"
              value={username}
              onChange={this.handleUsername}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="form-control"
              value={email}
              onChange={this.handleEmail}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary">
            Update Profile
          </button>
        </form>
      </div>
    );
  }
}

export default UserProfile;
