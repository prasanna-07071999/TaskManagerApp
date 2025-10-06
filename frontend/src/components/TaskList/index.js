import { Component } from 'react';
import { withRouter } from 'react-router-dom';
import Cookie from 'js-cookie';
import './index.css'

class TaskList extends Component {
  state = {
    tasks: [],
    isLoading: true,
    error: null,
  };

  componentDidMount() {
    this.getTasks()
  }

  getTasks = async () => {
    const jwtToken = Cookie.get('jwt_token');
    const url = 'https://taskmanagerapp-backend-xko3.onrender.com/tasks'
     const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
        'Content-Type': 'application/json',
      },
      method: 'GET',
    }
    const response = await fetch(url, options)
    if (response.ok === true) {
      const fetchedData = await response.json()
      this.setState({
        tasks: fetchedData
      })
    }
  }

  handleEdit = (id) => {  
    console.log(id)
    const {history} = this.props
    history.push(`/taskform?id=${id}`);
  };

  render() {
    const { tasks, loading, error } = this.state;
    if (loading) return <div className="container mt-4">Loading tasks...</div>;
    if (error)
      return (
        <div className="container mt-4">
          <div className="alert alert-danger">Failed to load tasks: {error}</div>
        </div>
      );

    return (
      <div className="container mt-4">
        <h2>Your Tasks</h2>
        {tasks.length === 0 ? (
          <p>No tasks found. Create one from the Task Form.</p>
        ) : (
          <div className="table-responsive">
            <div className="container mt-4">
            <div className="row fw-bold bg-light border p-2">
              <div className="col-1">S No</div>
              <div className="col-2">Title</div>
              <div className="col-2">Status</div>
              <div className="col-3">Description</div>
              <div className="col-2">Due Date</div>
              <div className="col-2">Actions</div>
            </div>
            {tasks.map(({ id, title, description, status, due_date }, index) => {
              let statusClass = "btn-secondary";
              if (status.toLowerCase() === "completed") {
                statusClass = "btn btn-success";
              } else if (
                status.toLowerCase() === "yet to start" ||
                status.toLowerCase() === "todo"
              ) {
                statusClass = "btn btn-danger";
              } else if (
                status.toLowerCase() === "inprogress" ||
                status.toLowerCase() === "in progress"
              ) {
                statusClass = "btn btn-warning";
              }

              return (
                <div key={id} className="row align-items-center border-bottom py-2">
                  <p className="col-1 mb-0">{index + 1}</p>
                  <h1 className="col-2 title-text mb-0">{title}</h1>
                  <button className={`btn btn-sm ${statusClass} px-3 col-2`} disabled>
                    {status}
                  </button>
                  <p className="col-3 mb-0">{description}</p>
                  <p className="col-2 mb-0">
                    {due_date ? new Date(due_date).toLocaleDateString() : '—'}
                  </p>
                  <div className="col-2">
                    <button className="btn btn-sm btn-primary m-2" onClick={() => this.handleEdit(id)}>
                      Edit
                    </button>
                  </div>
              </div>
            );
      })}
</div>
</div>
)}
      </div>
    );
  }
}

export default withRouter(TaskList);
