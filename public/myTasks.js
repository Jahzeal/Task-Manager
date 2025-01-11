const getTask = document.querySelector('.mytask')
const tasksDOM = document.querySelector('.tasks')
const loadingDOM = document.querySelector('.loading-text')
const showTasks = async () => {
  loadingDOM.style.visibility = 'visible';

  try {
    const token = localStorage.getItem('token');

    if (!token) {
      console.log('No token found, redirecting to login page.');
      setTimeout(() => {
        window.location.href = '/loginPage.html'; // Replace with your login page URL
      }, 1000);
      return;
    }

    console.log('Token:', token);

    const {
      data: { tasks },
    } = await axios.get('/api/v1/tasks', {
      headers: {
        Authorization: `Bearer ${token}`, // Token sent in the request header
      }
    });

    if (tasks.length < 1) {
      tasksDOM.innerHTML = '<h5 class="empty-list">No tasks in your list</h5>';
      loadingDOM.style.visibility = 'hidden';
      return;
    }

    const allTasks = tasks
      .map((task) => {
        const { completed, _id: taskID, name, deadline } = task;
        const dateOnly = deadline ? new Date(deadline).toLocaleDateString('en-CA') : 'N/A';
        return `
          <tr>
            <td>${name}</td>
            <td>${deadline ? dateOnly : 'N/A'}</td>
            <td><span class="status ${completed ? 'completed' : 'in-progress'}">${completed ? 'Completed' : 'In Progress'}</span></td>
            <td><a href="task.html?id=${taskID}" class="update-link">Update</a></td>
          </tr>
        ` ;
      })
      .join('');
    tasksDOM.innerHTML = `
      <table class="table">
        <thead>
          <tr>
            <th>Task Name</th>
            <th>Deadline</th>
            <th>Status</th>
            <th>Edit</th>
          </tr>
        </thead>
        <tbody>
          ${allTasks}
        </tbody>
      </table>
    `;
  } catch (error) {
    console.error('Error fetching tasks:', error);

    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      console.log('Authentication error, redirecting to login page.');
      setTimeout(() => {
        window.location.href = '/loginPage.html'; 
      }, 1000);
      return;
    }

    tasksDOM.innerHTML = '<h5 class="empty-list">There was an error, please try later....</h5>';
  } finally {
    loadingDOM.style.visibility = 'hidden';
  }
};

showTasks();