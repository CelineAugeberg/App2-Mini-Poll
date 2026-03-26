import "./views/user_app.mjs";
import "./views/user_created.mjs";
import "./views/user_login.mjs";
import "./views/user_settings.mjs";
import "./views/poll_create.mjs";
import "./views/poll_view.mjs";

import { signup, login, logout, getAuth } from "./controller/auth_controller.mjs";
import { deleteMyAccount, updatePassword } from "./controller/user_controller.mjs";
import { createPoll, getMyPolls } from "./controller/poll_controller.mjs";
import { t } from "./i18n/translations.mjs";

const root = document.querySelector("user-app");
if (!root) throw new Error("<user-app> not found");

function setStatus(msg) {
  if (typeof root.setStatus === "function") return root.setStatus(msg);
  const el = root.querySelector("#status");
  if (el) el.textContent = msg || "";
}

// --- Routing ---

let cachedPolls = [];

function getPollId() {
  const m = location.hash.match(/^#poll\/(\d+)$/);
  return m ? m[1] : null;
}

async function handleRoute() {
  const pollId = getPollId();

  if (pollId) {
    root.style.display = "none";
    let view = document.querySelector("poll-view");
    if (!view || view.dataset.pollId !== pollId) {
      view?.remove();
      view = document.createElement("poll-view");
      view.dataset.pollId = pollId;
     
      const cached = cachedPolls.find((p) => String(p.id) === pollId);
      if (cached) view.preloadedPoll = cached;
      view.currentUserId = getAuth().user?.id ?? null;
      document.body.appendChild(view);
    }
  } else {
    document.querySelector("poll-view")?.remove();
    root.style.display = "";
    await rerender();
  }
}

window.addEventListener("hashchange", handleRoute);

async function rerender() {
  const auth = getAuth();
  cachedPolls = [];
  if (auth.token) {
    try { cachedPolls = await getMyPolls(); } catch { /* ignore */ }
  }
  root.render(auth, cachedPolls);
}

// --- Event listeners ---

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
    await rerender();
    setStatus("");
  } catch (err) {
    setStatus(err.message || t("wrongCredentials"));
  }
});

root.addEventListener("createpoll", async (e) => {
  const { question, options } = e.detail || {};
  setStatus("");
  try {
    const poll = await createPoll({ question, options });
    setStatus(t("pollCreated"));
    await rerender();
 
    const link = `${location.origin}/#poll/${poll.id}`;
    navigator.clipboard?.writeText(link).catch(() => {});
  } catch (err) {
    setStatus(err.message || t("couldNotCreatePoll"));
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
    await rerender();
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

// --- Init ---
handleRoute();
