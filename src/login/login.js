import "../assets/styles.css";

document.getElementById("login-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const submitButton = document.getElementById("submit-button");
  const errorMessage = document.getElementById("error-message");
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  // Reset error message
  errorMessage.style.display = "none";
  submitButton.disabled = true;
  submitButton.textContent = "Signing in...";

  try {
    const response = await fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Login failed");
    }

    // Handle successful login
    console.log("Login successful:", data);
    // window.location.href = '/dashboard';
  } catch (err) {
    errorMessage.textContent = err.message;
    errorMessage.style.display = "block";
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = "Sign In";
  }
});
