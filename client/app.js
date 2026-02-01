async function main() {
  const res = await fetch("http://localhost:3000/polls");
  const data = await res.json();
  document.querySelector("#app").textContent = `Server says: ${JSON.stringify(data)}`;
}



const API_BASE = "http://localhost:3000";

const appEl = document.getElementById("app");


const signupUsername = document.getElementById("signupUsername");
const signupPassword = document.getElementById("signupPassword");
const signupConsent = document.getElementById("signupConsent");
const signupBtn = document.getElementById("signupBtn");


const loginBtn = document.getElementById("loginBtn");

function setStatus(msg) {
  appEl.textContent = msg;
}

async function signUp() {
  const username = signupUsername.value.trim();
  const password = signupPassword.value;

  
  if (!username) return setStatus("Please enter a username");
  if (password.length < 8) return setStatus("Password must be at least 8 characters");
  if (!signupConsent.checked) return setStatus("You must accept Privacy Policy & Terms of Service");

  const body = {
    username,
    password,
    consent: {
      acceptedTos: true,
      acceptedPrivacy: true,
      version: "1.0"
    }
  };

  try {
    const res = await fetch(`${API_BASE}/users`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });

    const data = await res.json().catch(() => null);

    if (res.status === 201) {
      setStatus(`User created! id=${data.id}, username=${data.username || username}`);
    } else {
      
      setStatus(data?.error || `Error: ${res.status}`);
    }
  } catch (err) {
    setStatus("Could not connect to server. Is it running?");
  }
}

signupBtn.addEventListener("click", signUp);


loginBtn.addEventListener("click", () => {
  setStatus("Login not implemented yet (next step: /auth/login)");
});


main();
