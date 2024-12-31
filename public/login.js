const formDOM = document.querySelector(".form");
const usernameInputDOM = document.querySelector(".username-input");
const passwordInputDOM = document.querySelector(".password-input");
const formAlertDOM = document.querySelector(".form-alert");
const resultDOM = document.querySelector(".result");
const btnDOM = document.querySelector("#data");
const tokenDOM = document.querySelector(".token");
const LoginHeader = document.querySelector(".pgh-login");
const Login = document.querySelector(".btn-createAccount");
let screenStatus = false;

// Handling the change of the login when create account is clicked
Login.addEventListener("click", (e) => {
  e.preventDefault();
  if (LoginHeader.textContent === "Login") {
    LoginHeader.textContent = "Register";
    Login.textContent = "Login";
    screenStatus = true;
  } else {
    LoginHeader.textContent = "Login";
    Login.textContent = "Create New Account";
    screenStatus = false; 
  }
});

// Handle form submission (register)
formDOM.addEventListener("submit", async (e) => {
  e.preventDefault(); // Prevent default form submission
  formAlertDOM.classList.remove("text-success", "text-danger");

  const username = usernameInputDOM.value;
  const password = passwordInputDOM.value;
  if (screenStatus) {
    try {
      // Send username and password to the backend to register
      const { data } = await axios.post(
        "http://localhost:3000/api/v1/auth/register",
        {
          username,
          password,
        }
      );

      // If registration is successful, display success message
      formAlertDOM.style.display = "block";
      formAlertDOM.textContent =
        "User registered successfully! Redirecting to task manager...";
      formAlertDOM.classList.add("text-success");

      // Store the token in local storage (if returned)
      localStorage.setItem("token", data.token);

      // Redirect to task manager page after a short delay
      setTimeout(() => {
        window.location.href = "/index.html"; // Replace with your task manager URL
      }, 2000);
    } catch (error) {
      formAlertDOM.style.display = "block";
      formAlertDOM.textContent =
        error.response?.data?.msg || "Error registering user!";
      formAlertDOM.classList.add("text-danger");
    }
  } else {
    try {
      // Send username and password to the backend to register
      const { data } = await axios.post(
        "http://localhost:3000/api/v1/auth/login",
        {
          username,
          password,
        }
      );

      // If registration is successful, display success message
      formAlertDOM.style.display = "block";
      formAlertDOM.textContent =
        "Login successful! Redirecting to task manager...";
      formAlertDOM.classList.add("text-success");

      // Store the token in local storage (if returned)
      localStorage.setItem("token", data.token);

      // Redirect to task manager page after a short delay
      setTimeout(() => {
        window.location.href = "/index.html"; // Replace with your task manager URL
      }, 2000);
    } catch (error) {
      formAlertDOM.style.display = "block";
      formAlertDOM.textContent =
        error.response?.data?.msg || "Not Found!";
      formAlertDOM.classList.add("text-danger");
    }
    
  }
});

// Function to make authenticated API calls with the token
const getProtectedData = async () => {
  const token = localStorage.getItem("token");

  if (!token) {
    console.log("No token found, please login.");
    return;
  }

  try {
    // Send the token in the Authorization header for protected routes
    const response = await axios.get("http://localhost:3000/api/v1/tasks", {
      headers: {
        Authorization: `Bearer ${token}`, // Token sent in the request header
      },
    });

    console.log(response.data); // Process the response
  } catch (error) {
    console.error(
      "Error fetching tasks:",
      error.response?.data || error.message
    );
  }
};

getProtectedData();









