const retriveDate = document.querySelector(".todaysDate");
const greeting = document.querySelector(".greetingTag");
const taskspane = document.querySelector(".projectCompletedTab");
let searchBarFunc = document.querySelector(".search-bar");
const gottenfunc = document.querySelector(".gotten");
const searchButtonFunc = document.querySelector(".search-button");
const taskTablefunc = document.querySelector(".task-table");

document.addEventListener("DOMContentLoaded", function () {
  var calendarEl = document.getElementById("calendar");
  var calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: "dayGridMonth",
  });
  calendar.render();
});

const today = new Date();
const days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const dayName = days[today.getDay()];

// Format the date
const formattedDate = today.toLocaleDateString("en-US", {
  year: "numeric",
  month: "long",
  day: "numeric",
});

retriveDate.innerHTML = `${dayName}, ${formattedDate}`;

const getTime = () => {
  let hours = today.getHours().toString().padStart(2, "0");
  const period = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours ? hours : 12;
  if (period == "AM") {
    greeting.innerHTML = "Good Morning";
  }
  greeting.innerHTML = "Good Evening";
};

getTime();
searchButtonFunc.addEventListener("click", async (e) => {
  e.stopPropagation();
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get("/api/v1/tasks", {
      headers: { Authorization: `Bearer ${token}` },
    });

    const tasks = response.data.tasks;
    const searchQuery = searchBarFunc.value.trim();

    const foundTask = tasks.find(
      (task) => task.name.toLowerCase() === searchQuery.toLowerCase()
    );

    if (foundTask) {
      const { completed, name, deadline } = foundTask;
      const formattedDeadline = new Date(deadline).toLocaleDateString("en-CA");

      gottenfunc.innerHTML = `
        <tr>
          <td>${name}</td>
          <td>${formattedDeadline}</td>
          <td>${completed ? "✅ Yes" : "❌ No"}</td>
        </tr>
      `;
      if (taskTablefunc.style.display === "block") {
        taskTablefunc.style.display = "none";
      } else {
        taskTablefunc.style.display = "block";
      }

      document.body.addEventListener("click", function () {
        if (taskTablefunc.style.display == "block") {
          taskTablefunc.style.display = "none";
        }
      });

      taskTablefunc.addEventListener("click", function (event) {
        //is preventing bubbling
        event.stopPropagation();
      });
    } else {
      gottenfunc.innerHTML = "<tr><td colspan='4'>Task not found</td></tr>";
      document.querySelector(".task-table").style.display = "block";
    }

    console.log("success");
  } catch (error) {
    console.error("Error fetching tasks:", error);
  }
});
