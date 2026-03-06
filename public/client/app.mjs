import "./views/user_app.mjs";
import "./views/user_created.mjs";
import "./views/user_login.mjs";
import "./views/user_settings.mjs";

import { signup, login, logout, getAuth } from "./controller/auth_controller.mjs";
import { deleteMyAccount, updatePassword } from "./controller/user_controller.mjs";
import { t } from "./i18n/translations.mjs";


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

  if (!username || !password) return setStatus(t("usernameRequired"));
  if (!consent) return setStatus(t("consentRequired"));

  try {
    await signup({ username, password, consent });
    setStatus(t("userCreated"));

    if (typeof root.prefillLogin === "function") {
      root.prefillLogin({ username, password });
    }
  } catch (err) {
    setStatus(err.message || t("couldNotCreate"));
  }
});

root.addEventListener("login", async (e) => {
  const { username, password } = e.detail || {};
  setStatus("");

  if (!username || !password) return setStatus(t("usernameRequired"));

  try {
    await login({ username, password });
    rerender();
    setStatus("");
  } catch (err) {
    setStatus(err.message || t("wrongCredentials"));
  }
});

root.addEventListener("updatepassword", async (e) => {
  const { newPassword } = e.detail || {};
  setStatus("");

  if (!newPassword) return setStatus(t("passwordRequired"));

  try {
    await updatePassword({ newPassword });
    setStatus(t("passwordUpdated"));
  } catch (err) {
    setStatus(err.message || t("couldNotUpdate"));
  }
});

root.addEventListener("deleteaccount", async () => {
  setStatus("");

  const ok = confirm(t("deleteWarning"));
  if (!ok) return;

  try {
    await deleteMyAccount();
    rerender();
    setStatus(t("accountDeleted"));
  } catch (err) {
    setStatus(err.message || t("couldNotDelete"));
  }
});

root.addEventListener("logout", () => {
  logout();
  rerender();
  setStatus(t("loggedOut"));
});

root.addEventListener("statusmessage", (e) => {
  setStatus(e.detail?.message || "");
});


rerender();





