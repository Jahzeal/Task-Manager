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
  if (period === "AM") {
    greeting.innerHTML = "Good Morning";
  }
  greeting.innerHTML = "Good Evening";
};

getTime();
searchButtonFunc.addEventListener("click", async (e) => {
  e.stopPropagation();

  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No token found");

    const response = await axios.get("/api/v1/tasks", {
      headers: { Authorization: `Bearer ${token}` },
    });

    const tasks = response.data.tasks;
    const searchQuery = searchBarFunc.value.trim().toLowerCase();

    const foundTask = tasks.find((task) => task.name.toLowerCase() === searchQuery);

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
      taskTablefunc.style.display = "block";
    } else {
      gottenfunc.innerHTML = "<tr><td colspan='3'>Task not found</td></tr>";
      taskTablefunc.style.display = "block";
    }

    console.log("Search completed successfully");
  } catch (error) {
    console.error("Error fetching tasks:", error);
  }
});

// Ensure body click listener is added only once
document.body.addEventListener("click", (event) => {
  if (!taskTablefunc.contains(event.target)) {
    taskTablefunc.style.display = "none";
  }
});

// Prevent click event from bubbling when clicking inside the table
taskTablefunc.addEventListener("click", (event) => {
  event.stopPropagation();
});
