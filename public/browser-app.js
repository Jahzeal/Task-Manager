const tasksDOM = document.querySelector('.tasks')
const loadingDOM = document.querySelector('.loading-text')
const formDOM = document.querySelector('.task-form')
const taskInputDOM = document.querySelector('.task-input')
const formAlertDOM = document.querySelector('.form-alert')
const welcomeText = document.querySelector('.welcomeText')
const SubmitButton = document.getElementById('newTask')
const TaskFormElement = document.getElementById('taskFormID')
const submitTask = document.getElementById('submit-id')
const deadlineDate = document.querySelector('.taskDate')
let ascertainSpace = true;
const taskPage = document.querySelector('.mytask')
const completedElement = document.getElementById('completed')
const inprogressElement = document.getElementById('inprogress')
const logoutBtn = document.querySelector('.logOut')

// saveData.addEventListener("click", async () => {
//   try {
//     const token = localStorage.getItem("token");

//     if (!token) {
//       console.log("No token found, please login.");
//       setTimeout(() => {
//         window.location.href = "/loginPage.html";
//       }, 1000);
//       return;
//     }

//     const notesInput = document.querySelector('#notesInput'); 
//     const notes = notesInput.value;

//     // Send the data to the server
//     const response = await axios.post(
//       '/api/v1/tasks',
//       { notes }, // Payload data
//       {
//         headers: {
//           Authorization: `Bearer ${token}`, // Token sent in the request header
//         },
//       }
//     );

//     console.log('Response from server:', response.data);

//     // Optionally clear the input field after saving
//     // notesInput.value = '';

//   } catch (error) {
//     console.error("Error handling the click event:", error);
//   }
// });

//logout

logoutBtn.addEventListener("click", async (e) => {
  localStorage.removeItem("token");
  window.location.reload();
})

taskPage.addEventListener('click', async (e) => {
  ascertainSpace = false
})



// token validation
// const getTokenOrRedirect = () => {
//   const token = localStorage.getItem("token");
//   if (!token) {
//     setTimeout(() => {
//       window.location.href = "/loginPage.html";
//     }, 1000);
//     return null;
//   }
//   return token;
// };

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
      },
    });
    console.log('success');

    if (tasks.length < 1) {
      tasksDOM.innerHTML = '<h5 class="empty-list">No tasks in your list</h5>';
      loadingDOM.style.visibility = 'hidden';
      return;
    }
    const completedTasks = tasks.filter((task) => task.completed === true);
    const completedTaskCount = completedTasks.length; // Count completed tasks
    completedElement.innerHTML = `${completedTaskCount} Completed Task(s)`

    ///inprogress
    const incompletedTasks = tasks.filter((task) => task.completed === false);
    const inprogressTaskCount = incompletedTasks.length;
    inprogressElement.innerHTML = `${inprogressTaskCount} projects in progress`
    
    
    

    
    let displayTasks = tasks;
    if (ascertainSpace) {
      displayTasks = tasks.slice(0, 3); // Only show the first 3 tasks if `ascertainSpace` is true
    }
    console.log('good');

    // Map over filtered tasks and generate the table rows
    const allTasks = displayTasks
      .map((task) => {
        const { completed, _id: taskID, name, deadline } = task;
        const dateOnly = deadline ? new Date(deadline).toLocaleDateString('en-CA') : 'N/A';
        
        return `
          <tr>
            <td>${name}</td>
            <td>${deadline ? dateOnly : 'N/A'}</td>
            <td><span class="status ${completed ? 'completed' : 'in-progress'}">${completed ? 'Completed' : 'In Progress'}</span></td>
            <td>
              <a href="task.html?id=${taskID}" class="update-link">Update</a>
            </td>
            <td><button class="delete-btn" id="${taskID}">Delete</button></td>
          </tr>
        `;
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
            <th>Delete Task</th>
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
        window.location.href = '/loginPage.html'; // Replace with your login page URL
      }, 1000);
      return;
    }

    tasksDOM.innerHTML = '<h5 class="empty-list">There was an error, please try later....</h5>';
  } finally {
    loadingDOM.style.visibility = 'hidden';
  }
};

showTasks();



SubmitButton.addEventListener('click', async (e) => {
  e.stopPropagation();
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      console.log("No token found, please login.");
      setTimeout(() => {
        window.location.href = "/loginPage.html";
      }, 1000);
      return;
    }

    // Make form visible
    if (TaskFormElement.style.display === 'block') {
      TaskFormElement.style.display = 'none'; 
    } else {
      TaskFormElement.style.display = 'block'; // Show the form
    }
  } catch (error) {
    console.error("Error handling the click event:", error);
  }
});

document.body.addEventListener("click", function () {
  if (TaskFormElement.style.display == 'block') {
    TaskFormElement.style.display= 'none'
  }
});

TaskFormElement.addEventListener("click", function (event) {  //is prevent bubbling
  event.stopPropagation();
});















// delete task /api/tasks/:id

tasksDOM.addEventListener('click', async (e) => {
  const el = e.target;
  
  // Check if the click is on a delete button
  if (el.classList.contains('delete-btn')) {
    loadingDOM.style.visibility = 'visible';
    
    // Get the task ID from data attribute
    const id = el.id;
    console.log('Deleting task with ID:', id);

    try {
      const token = localStorage.getItem("token");

      // If no token is found, redirect to login
      if (!token) {
        console.log("No token found, please login.");
        setTimeout(() => {
          window.location.href = "/loginPage.html"; // Redirect to login page
        }, 1000);
        return;
      }

      // Perform the DELETE request to remove the task
      await axios.delete(`/api/v1/tasks/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`, // Token sent in the request header
        },
      });

      // Re-fetch and display tasks
      showTasks();
    } catch (error) {
      console.error('Error deleting task:', error);
    } finally {
      // Ensure loading spinner is hidden regardless of success/failure
      loadingDOM.style.visibility = 'hidden';
    }
  }
});










formDOM.addEventListener('submit', async (e) => {
  e.preventDefault()
  const name = taskInputDOM.value
  const deadline = deadlineDate.value
  console.log(name, deadline);
  const taskData = {
    name,
    deadline
  }

  try {
    const token = localStorage.getItem("token");

    if (!token) {
      setTimeout(() => {   
        window.location.href = "/loginPage.html"; // Replace with your task manager URL
      }, 1000)
    console.log("No token found, please login.");
    return;
    }
    console.log(token);

    await axios.post('/api/v1/tasks', taskData,   {
      headers: {
        Authorization: `Bearer ${token}`, // Token sent in the request header
      },
    })
  
    taskInputDOM.value = ''
    formAlertDOM.style.display = 'block'
    formAlertDOM.textContent = `success, task added`
    formAlertDOM.classList.add('text-success')
    TaskFormElement.style.display = 'none';
    showTasks();
  } catch (error) {
    formAlertDOM.style.display = 'block'
    formAlertDOM.innerHTML = `error, please try again`
  }
  setTimeout(() => {
    formAlertDOM.style.display = 'none'
    formAlertDOM.classList.remove('text-success')
  }, 3000)
}) 

