// Import any styles if you have them
// import './styles/main.css';

// Client-side JavaScript
document.addEventListener("DOMContentLoaded", () => {
  // Initial page setup
  setupNavigation();
});

function setupNavigation() {
  // Handle client-side navigation
  document.addEventListener("click", (e) => {
    if (e.target.tagName === "A") {
      const href = e.target.getAttribute("href");
      if (href.startsWith("/")) {
        e.preventDefault();
        history.pushState(null, "", href);
        handleRoute(href);
      }
    }
  });

  // Handle browser back/forward buttons
  window.addEventListener("popstate", () => {
    handleRoute(window.location.pathname);
  });

  // Initial route handling
  handleRoute(window.location.pathname);
}

function handleRoute(path) {
  // You can add custom client-side routing logic here
  // For now, we'll let the server handle routing
  console.log(`Navigating to: ${path}`);
}
