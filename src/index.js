import "./index.css";

// Auth state management
let isAuthenticated = false;

// Authentication functions
async function login(username, password) {
  try {
    const response = await fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      throw new Error("Login failed");
    }

    isAuthenticated = true;
    localStorage.setItem("isAuthenticated", "true");
    handleRoute("/dashboard");
  } catch (error) {
    console.error("Login error:", error);
    showLoginError(error.message);
  }
}

function logout() {
  isAuthenticated = false;
  localStorage.removeItem("isAuthenticated");
  handleRoute("/");
}

function checkAuth() {
  return localStorage.getItem("isAuthenticated") === "true";
}

// Route definitions with auth requirements
const routes = {
  "/": {
    auth: false,
    render: () => {
      showLandingPage();
    },
  },
  "/login": {
    auth: false,
    render: () => {
      showLandingPage(false);
      document.getElementById("app").innerHTML = `
        <div class="login-page">
          <div class="login-page__container">
            <h1 class="login-page__title">Welcome Back</h1>
            <div id="error-message" class="login-page__error"></div>
            <form id="login-form" class="login-page__form">
              <div class="login-page__form-group">
                <label class="login-page__label" for="username">Username</label>
                <input
                  class="login-page__input"
                  type="text"
                  id="username"
                  name="username"
                  required
                />
              </div>
              <div class="login-page__form-group">
                <label class="login-page__label" for="password">Password</label>
                <input
                  class="login-page__input"
                  type="password"
                  id="password"
                  name="password"
                  required
                />
              </div>
              <button class="login-page__button" type="submit" id="submit-button">
                Sign In
              </button>
            </form>
          </div>
        </div>
      `;

      // Add login form handler
      document
        .getElementById("login-form")
        .addEventListener("submit", async (e) => {
          e.preventDefault();
          const submitButton = document.getElementById("submit-button");
          submitButton.disabled = true;
          submitButton.textContent = "Signing in...";

          try {
            const username = document.getElementById("username").value;
            const password = document.getElementById("password").value;
            await login(username, password);
          } catch (error) {
            const errorMessage = document.getElementById("error-message");
            errorMessage.textContent =
              error.message || "Login failed. Please try again.";
            errorMessage.style.display = "block";
            submitButton.disabled = false;
            submitButton.textContent = "Sign In";
          }
        });
    },
  },
  "/dashboard": {
    auth: true,
    render: () => {
      showLandingPage(false);
      document.getElementById("app").innerHTML = `
        <div class="dashboard">
          <nav class="dashboard-nav">
            <a href="/dashboard" class="nav-link">Dashboard</a>
            <a href="/profile" class="nav-link">Profile</a>
            <button onclick="logout()" class="logout-btn">Logout</button>
          </nav>
          <h1>Dashboard</h1>
          <p>Welcome to your dashboard!</p>
        </div>
      `;
    },
  },
  "/profile": {
    auth: true,
    render: () => {
      showLandingPage(false);
      document.getElementById("app").innerHTML = `
        <div class="dashboard">
          <nav class="dashboard-nav">
            <a href="/dashboard" class="nav-link">Dashboard</a>
            <a href="/profile" class="nav-link">Profile</a>
            <button onclick="logout()" class="logout-btn">Logout</button>
          </nav>
          <h1>Profile</h1>
          <p>Your profile information goes here.</p>
        </div>
      `;
    },
  },
};

function showLandingPage(show = true) {
  const landingPage = document.getElementById("landing-page");
  const app = document.getElementById("app");

  if (show) {
    landingPage.style.display = "block";
    app.style.display = "none";
  } else {
    landingPage.style.display = "none";
    app.style.display = "block";
  }
}

function showLoginError(message) {
  const errorMessage = document.getElementById("error-message");
  if (errorMessage) {
    errorMessage.textContent = message;
    errorMessage.style.display = "block";
  }
}

function handleRoute(path) {
  console.log("handleRoute called with path:", path); // Debug log

  const route = routes[path] || {
    auth: false,
    render: () => {
      showLandingPage(false);
      document.getElementById("app").innerHTML = `
        <h1>404 - Page Not Found</h1>
        <p>The page you're looking for doesn't exist.</p>
        <a href="/" class="back-link">Back to Home</a>
      `;
    },
  };

  console.log("Route found:", route); // Debug log

  // Check authentication
  if (route.auth && !checkAuth()) {
    console.log("Auth required but not authenticated"); // Debug log
    history.pushState(null, "", "/login");
    routes["/login"].render();
    return;
  }

  // Execute the route handler
  route.render();
  updateActiveNavigation(path);
}

function updateActiveNavigation(path) {
  document.querySelectorAll(".nav-link").forEach((link) => {
    link.classList.remove("active");
    if (link.getAttribute("href") === path) {
      link.classList.add("active");
    }
  });
}

function setupNavigation() {
  console.log("Setting up navigation..."); // Debug log

  // Check initial authentication state
  isAuthenticated = checkAuth();

  // Handle client-side navigation
  document.addEventListener("click", (e) => {
    // Find closest anchor or button
    const target = e.target.closest("a, button");
    console.log("Click target:", target); // Debug log

    if (target) {
      // Handle both href and data-route
      const href = target.getAttribute("href");
      console.log("Clicked href:", href); // Debug log

      // Handle login buttons specifically
      if (target.classList.contains("landing-page__login-btn")) {
        console.log("Login button clicked"); // Debug log
        e.preventDefault();
        history.pushState(null, "", "/login");
        handleRoute("/login");
        return;
      }

      // Handle other navigation
      if (href && href.startsWith("/")) {
        e.preventDefault();
        history.pushState(null, "", href);
        handleRoute(href);
      }
    }
  });

  // Handle browser back/forward buttons
  window.addEventListener("popstate", () => {
    console.log("Popstate event, pathname:", window.location.pathname); // Debug log
    handleRoute(window.location.pathname);
  });

  // Initial route handling
  console.log("Initial route:", window.location.pathname); // Debug log
  handleRoute(window.location.pathname);
}

// Make sure setupNavigation runs after DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM loaded, setting up navigation"); // Debug log
  setupNavigation();
});

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  setupNavigation();
});

// Export for use in other modules if needed
export { login, logout, checkAuth };
