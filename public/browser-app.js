const tasksDOM = document.querySelector('.tasks')
const loadingDOM = document.querySelector('.loading-text')
const formDOM = document.querySelector('.task-form')
const taskInputDOM = document.querySelector('.task-input')
const formAlertDOM = document.querySelector('.form-alert')
const welcomeText = document.querySelector('.welcomeText')
const but = document.getElementById('newTask')
const woman = document.getElementById('tolu')
const submitTask = document.getElementById('submit-id')
const deadlineDate = document.querySelector('.taskDate')




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

    if (tasks.length < 1) {
      tasksDOM.innerHTML = '<h5 class="empty-list">No tasks in your list</h5>';
      loadingDOM.style.visibility = 'hidden';
      return;
    }

    // Map over tasks and generate the table rows
    const allTasks = tasks
      .map((task) => {
        const { completed, _id: taskID, name, deadline } = task;
        return `
          <tr>
            <td>${name}</td>
            <td>${deadline ? deadline : 'N/A'}</td>
            <td><span class="status ${completed ? 'completed' : 'in-progress'}">${completed ? 'Completed' : 'In Progress'}</span></td>
            <td><a href="task.html?id=${taskID}" class="update-link">Update</a></td>
          </tr>
        ` ;
      })
      .slice(0, 3)
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


but.addEventListener('click', async (e) => {
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
    woman.style.display = 'block';
  } catch (error) {
    console.error("Error handling the click event:", error);
  }
});













// delete task /api/tasks/:id


// tasksDOM.addEventListener('click', async (e) => {
//   const el = e.target
//   if (el.parentElement.classList.contains('delete-btn')) {
//     loadingDOM.style.visibility = 'visible'
//     const id = el.parentElement.dataset.id
//     try {
//       const token = localStorage.getItem("token");

//       if (!token) {
//         etTimeout(() => {
//           window.location.href = "/loginPage.html";
//         }, 1000)
//     console.log("No token found, please login.");
//     return;
//     }
//     console.log(token);
//       await axios.delete(`/api/v1/tasks/${id}`,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`, // Token sent in the request header
//           },
//         }
//       )

//       showTasks()
//     } catch (error) {
//       console.log(error)
//     }
//   }
//   loadingDOM.style.visibility = 'hidden'
// })












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
      etTimeout(() => {   
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
    woman.style.display = 'none';
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
