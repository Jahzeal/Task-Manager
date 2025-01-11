const taskIDDOM = document.querySelector('.task-edit-id')
const taskNameDOM = document.querySelector('.task-edit-name')
const taskCompletedDOM = document.querySelector('.task-edit-completed')
const editFormDOM = document.querySelector('.single-task-form')
const editBtnDOM = document.querySelector('.task-edit-btn')
const formAlertDOM = document.querySelector('.form-alert')
const params = window.location.search
const id = new URLSearchParams(params).get('id')
let tempName
const showTask = async () => {
  const token = localStorage.getItem('token');
  if (!token) {
    console.error('No token found, redirecting to login.');
    window.location.href = '/loginPage.html';
    return;
  }
  try {
    const {
      data: { task },
    } = await axios.get(`/api/v1/tasks/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const { _id: taskID, completed, name,deadline } = task;

    taskIDDOM.textContent = taskID;
    taskNameDOM.value = name;
    tempName = name;
    if (completed) {
      taskCompletedDOM.checked = true;
    }
  } catch (error) {
    console.error('Error fetching task:', error);
    if (error.response?.status === 401) {
      console.error('Unauthorized access. Redirecting to login.');
      window.location.href = '/loginPage.html';
    }
  }
};

showTask();
editFormDOM.addEventListener('submit', async (e) => {
  editBtnDOM.textContent = 'Loading...';
  e.preventDefault();
  const token = localStorage.getItem('token'); // Retrieve token

  try {
    const taskName = taskNameDOM.value;
    const taskCompleted = taskCompletedDOM.checked;

    // Make the PATCH request
    const {
      data: { task },
    } = await axios.patch(
      `/api/v1/tasks/${id}`,
      {
        name: taskName, // Data payload
        completed: taskCompleted,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`, // Token in headers
        },
      }
    );

    const { _id: taskID, completed, name } = task;

    // Update the UI
    taskIDDOM.textContent = taskID;
    taskNameDOM.value = name;
    tempName = name;
    taskCompletedDOM.checked = completed;

    // Show success alert
    formAlertDOM.style.display = 'block';
    formAlertDOM.textContent = `Success, edited task`;
    formAlertDOM.classList.add('text-success');
    showTask()
  } catch (error) {
    // Handle errors
    console.error('Error:', error);
    taskNameDOM.value = tempName; // Revert task name to temporary name
    formAlertDOM.style.display = 'block';
    formAlertDOM.textContent = `Error, please try again`;
    formAlertDOM.classList.add('text-danger');
  }

  editBtnDOM.textContent = 'Edit';

  // Hide alert after 3 seconds
  setTimeout(() => {
    formAlertDOM.style.display = 'none';
    formAlertDOM.classList.remove('text-success', 'text-danger');
  }, 3000);
});

