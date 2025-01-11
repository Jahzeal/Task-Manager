const retriveDate = document.querySelector('.todaysDate')
const greeting = document.querySelector('.greetingTag')
const taskspane = document.querySelector('.projectCompletedTab')

document.addEventListener('DOMContentLoaded', function() {
  var calendarEl = document.getElementById('calendar');
  var calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: 'dayGridMonth'
  });
  calendar.render();
});


const today = new Date();
const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const dayName = days[today.getDay()];

// Format the date
const formattedDate = today.toLocaleDateString('en-US', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
});

retriveDate.innerHTML = `${dayName}, ${formattedDate}`;



const getTime = () => {
  let hours = today.getHours().toString().padStart(2, '0');
  const period = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12; 
  hours = hours ? hours : 12; 
  if (period == 'AM') {
    greeting.innerHTML = 'Good Morning'
  }
  greeting.innerHTML = 'Good Evening'
}

getTime()




