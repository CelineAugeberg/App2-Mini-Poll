const API_BASE = "http://localhost:3000";
let authToken = null;

const signupUsername = document.getElementById("signupUsername");
const signupPassword = document.getElementById("signupPassword");
const signupConsent = document.getElementById("signupConsent");
const signupBtn = document.getElementById("signupBtn");

const loginUsername = document.getElementById("loginUsername");
const loginPassword = document.getElementById("loginPassword");
const loginBtn = document.getElementById("loginBtn");

const dashboardEl = document.getElementById("dashboard");
const welcomeText = document.getElementById("welcomeText");
const deleteBtn = document.getElementById("deleteBtn");
const logoutBtn = document.getElementById("logoutBtn");

const statusEl = document.getElementById("status");

function setStatus(msg) {
  statusEl.textContent = msg || "";
}

function showDashboard(username) {
  dashboardEl.hidden = false;
  welcomeText.textContent = `Welcome, ${username}`;
}

function hideDashboard() {
  dashboardEl.hidden = true;
  welcomeText.textContent = "";
}

async function signUp() {
  setStatus("");

  const username = signupUsername.value.trim();
  const password = signupPassword.value;

  if (!signupConsent.checked) return setStatus("You must accept ToS & Privacy Policy");

  const res = await fetch(`${API_BASE}/users`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password, consent: true })
  });

  if (res.status === 201) {
    setStatus("User created. Now log in.");
    loginUsername.value = username;
    loginPassword.value = password;
  } else if (res.status === 409) {
    setStatus("Username already in use");
  } else {
    setStatus("Could not create user");
  }
}

async function login() {
  setStatus("");

  const username = loginUsername.value.trim();
  const password = loginPassword.value;

  const res = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password })
  });

  const data = await res.json().catch(() => null);

  if (res.status === 200) {
    authToken = data.auth;
    showDashboard(data.user.username);
    setStatus("");
  } else {
    setStatus("Wrong username or password");
  }
}

async function deleteAccount() {
  setStatus("");

  const res = await fetch(`${API_BASE}/users/me`, {
    method: "DELETE",
    headers: { "x-access-auth": authToken }
  });

  if (res.status === 204) {
    authToken = null;
    hideDashboard();
    setStatus("Account deleted (consent revoked).");
  } else {
    setStatus("Could not delete account");
  }
}

function logout() {
  authToken = null;
  hideDashboard();
  setStatus("Logged out");
}

signupBtn.addEventListener("click", signUp);
loginBtn.addEventListener("click", login);
deleteBtn.addEventListener("click", deleteAccount);
logoutBtn.addEventListener("click", logout);



