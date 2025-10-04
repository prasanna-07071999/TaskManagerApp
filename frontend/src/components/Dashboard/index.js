import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { BsCheckCircle, BsClock, BsList, BsCheckSquare } from 'react-icons/bs';

class Dashboard extends Component {
  state = {
    totalTasks: 20,
    tasksToDo: 8,
    tasksInProgress: 6,
    tasksCompleted: 6,
    recentTasks: [
      { id: 1, title: 'Need to finish Project Report', status: 'In Progress', dueDate: '2025-10-10' },
      { id: 2, title: 'Review Project', status: 'To Do', dueDate: '2025-10-07' },
      { id: 3, title: 'Team Meeting', status: 'Completed', dueDate: '2025-10-01' },
    ],
  };

  navigateTo = (id) => {
    const {history} = this.props
    history.replace(id);
  };

  renderStatusBadge = (status) => {
    const statusMap = {
      'To Do': { color: 'warning', icon: <BsClock /> },
      'In Progress': { color: 'primary', icon: <BsList /> },
      'Completed': { color: 'success', icon: <BsCheckCircle /> },
    };
    const { color, icon } = statusMap[status] || { color: 'secondary', icon: null };
    return (
      <span className={`badge bg-${color} d-flex align-items-center`}>
        {icon} <span className="ms-1">{status}</span>
      </span>
    );
  };

  render() {
    const { totalTasks, tasksToDo, tasksInProgress, tasksCompleted, recentTasks } = this.state;

    return (
      <div className="container p-4">
        <h1 className="mb-4">Welcome back</h1>
        <div className="row mb-4">
          <div className="col-md-3">
            <div className="card text-white bg-info mb-3">
              <div className="card-body d-flex align-items-center">
                <BsList size={24} className="me-3" />
                <div>
                  <h5>Total Tasks</h5>
                  <p className="mb-0 fs-4">{totalTasks}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-3">
            <div className="card text-white bg-warning mb-3">
              <div className="card-body d-flex align-items-center">
                <BsClock size={24} className="me-3" />
                <div>
                  <h5>Tasks To Do</h5>
                  <p className="mb-0 fs-4">{tasksToDo}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-3">
            <div className="card text-white bg-primary mb-3">
              <div className="card-body d-flex align-items-center">
                <BsList size={24} className="me-3" />
                <div>
                  <h5>In Progress</h5>
                  <p className="mb-0 fs-4">{tasksInProgress}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-3">
            <div className="card text-white bg-success mb-3">
              <div className="card-body d-flex align-items-center">
                <BsCheckCircle size={24} className="me-3" />
                <div>
                  <h5>Completed</h5>
                  <p className="mb-0 fs-4">{tasksCompleted}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-4">
          <button type="button" className="btn btn-primary me-2" onClick={() => this.navigateTo('/taskform')}>
            Create New Task
          </button>
          <button type="button" className="btn btn-secondary me-2" onClick={() => this.navigateTo('/tasks')}>
            View All Tasks
          </button>
          <button type="button" className="btn btn-outline-info" onClick={() => this.navigateTo('/profile')}>
            View Profile
          </button>
        </div>
        <div>
          <h3>Recent Tasks</h3>
          {recentTasks.length === 0 ? (
            <p>No recent tasks.</p>
          ) : (
            <div className="list-group">
              {recentTasks.map((task) => (
                <div key={task.id} className="list-group-item d-flex justify-content-between align-items-center">
                  <div>
                    <h5>{task.title}</h5>
                    {this.renderStatusBadge(task.status)}
                    <p className="mb-0 small text-muted">Due: {task.dueDate}</p>
                  </div>
                  <div>
                    {task.status !== 'Completed' && (
                      <button type="button" className="btn btn-success btn-sm" onClick={() => alert(`Marking task "${task.title}" as complete.`)}>
                        Mark Complete
                        <BsCheckSquare className="ms-1" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default withRouter(Dashboard);

