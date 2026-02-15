
import "./views/user_app.mjs";
import "./views/user_created.mjs";
import "./views/user_login.mjs";
import "./views/user_settings.mjs";


import { signup, login, logout } from "./controller/auth_controller.mjs";
import { deleteMyAccount, updatePassword } from "./controller/user_controller.mjs";
import { getAuth } from "./controller/auth_controller.mjs";


const root = document.querySelector("user-app");
if (!root) throw new Error("<user-app> not found");


function setStatus(msg) {

  if (typeof root.setStatus === "function") return root.setStatus(msg);


  const el = root.querySelector("#status");
  if (el) el.textContent = msg || "";
}


function rerender() {
  if (typeof root.render === "function") root.render(getAuth());
}


root.addEventListener("signup", async (e) => {
  const { username, password, consent } = e.detail || {};
  setStatus("");

  if (!username || !password) return setStatus("Username and password required.");
  if (!consent) return setStatus("You must accept ToS & Privacy Policy.");

  try {
    await signup({ username, password, consent: true });
    setStatus("User created. Now log in.");

 
    if (typeof root.prefillLogin === "function") {
      root.prefillLogin({ username, password });
    }
  } catch (err) {
    setStatus(err.message || "Could not create user");
  }
});

root.addEventListener("login", async (e) => {
  const { username, password } = e.detail || {};
  setStatus("");

  if (!username || !password) return setStatus("Username and password required.");

  try {
    await login({ username, password });
    rerender();
    setStatus("");
  } catch (err) {
    setStatus(err.message || "Wrong username or password");
  }
});

root.addEventListener("updatepassword", async (e) => {
  const { newPassword } = e.detail || {};
  setStatus("");

  if (!newPassword) return setStatus("New password required.");

  try {
    await updatePassword({ newPassword });
    setStatus("Password updated successfully!");
  } catch (err) {
    setStatus(err.message || "Could not update password");
  }
});

root.addEventListener("deleteaccount", async () => {
  setStatus("");

  const ok = confirm("Delete your account? This cannot be undone.");
  if (!ok) return;

  try {
    await deleteMyAccount();
    rerender();
    setStatus("Account deleted (consent revoked).");
  } catch (err) {
    setStatus(err.message || "Could not delete account");
  }
});

root.addEventListener("logout", () => {
  logout();
  rerender();
  setStatus("Logged out");
});


rerender();





