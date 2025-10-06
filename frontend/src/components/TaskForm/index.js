import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import Cookie from 'js-cookie'

class TaskForm extends Component {
  state = {
    id: null,               
    title: '',
    description: '',
    status: 'yet to start',
    due_date: '',           
    message: '',
    loading: false,
    error: null,
  };

  componentDidMount() {
    const params = new URLSearchParams(this.props.location.search);
    const taskId = params.get('id');
    if (taskId) {
      this.fetchTaskDetails(taskId);
    }
  }

  fetchTaskDetails = async (id) => {
  this.setState({ loading: true, error: null });
  const token = Cookie.get('jwt_token');
  const url = `https://taskmanagerapp-th5h.onrender.com/tasks/${id}`;
  const options = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  try {
    const response = await fetch(url, options);
    if (response.ok === true) {
      const fetchedData = await response.json();
      this.setState({
        id: fetchedData.id,
        title: fetchedData.title,
        description: fetchedData.description,
        status: fetchedData.status,
        due_date: fetchedData.due_date ? fetchedData.due_date.split('T')[0] : '',
        loading: false,
      });
    } else {
      this.setState({ error: 'Failed to fetch task details', loading: false });
    }
  } catch (error) {
    this.setState({ error: error.message, loading: false });
  }
};


  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    const { id, title, description, status, due_date } = this.state;
    const token = Cookie.get('jwt_token');
    const url = id ? `https://taskmanagerapp-th5h.onrender.com/tasks/${id}` : 'https://taskmanagerapp-th5h.onrender.com/tasks';
    const method = id ? 'PUT' : 'POST';
    const options = {
      method,
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title, description, status, due_date }),
    }
    try {
    const response = await fetch(url, options);
    if (response.ok === true) {
      const fetchedData = await response.json();
      console.log(fetchedData)
      this.setState({ message: 'Task submitted!', loading: false });
      this.props.history.push('/tasks');
    } else {
      const errorData = await response.json();
      this.setState({ error: errorData.error_msg || 'Failed to submit task', loading: false });
    }
  } catch (error) {
    this.setState({ error: error.message, loading: false });
  }
      
  };

  render() {
    const { title, description, status, due_date, loading, error } = this.state;

    if (loading) return <div className="container mt-4">Loading...</div>;

    return (
      <div className="container mt-4">
        <h2>{this.state.id ? 'Edit Task' : 'Create Task'}</h2>

        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={this.handleSubmit}>
          <div className="mb-3">
            <label htmlFor="title" className="form-label">
              Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              className="form-control"
              value={title}
              onChange={this.handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="description" className="form-label">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              className="form-control"
              rows="4"
              value={description}
              onChange={this.handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="status" className="form-label">
              Status
            </label>
            <select
              id="status"
              name="status"
              className="form-select"
              value={status}
              onChange={this.handleChange}
              required
            >
              <option value="yet to start">Yet to Start</option>
              <option value="inProgress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          <div className="mb-3">
            <label htmlFor="due_date" className="form-label">
              Due Date
            </label>
            <input
              type="date"
              id="due_date"
              name="due_date"
              className="form-control"
              value={due_date}
              onChange={this.handleChange}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary">
            Submit Task
          </button>
        </form>
      </div>
    );
  }
}

export default withRouter(TaskForm);

