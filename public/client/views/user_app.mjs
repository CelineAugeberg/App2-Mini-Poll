import { t } from "../i18n/translations.mjs";

class UserApp extends HTMLElement {
  constructor() {
    super();
    this.auth = null;
  }

  connectedCallback() {
    this.render(null);
  }

  setStatus(msg) {
    const statusEl = this.querySelector("#status");
    if (statusEl) statusEl.textContent = msg || "";
  }

  #switchTab(tab) {
    this.querySelectorAll(".tab-btn").forEach(btn => {
      const isActive = btn.dataset.tab === tab;
      btn.classList.toggle("active", isActive);
      btn.setAttribute("aria-selected", isActive ? "true" : "false");
      btn.setAttribute("tabindex", isActive ? "0" : "-1");
    });
    this.querySelector("user-created").classList.toggle("hidden", tab !== "signup");
    this.querySelector("user-login").classList.toggle("hidden", tab !== "login");
    this.querySelector("#panel-signup").setAttribute("aria-hidden", tab !== "signup" ? "true" : "false");
    this.querySelector("#panel-login").setAttribute("aria-hidden", tab !== "login" ? "true" : "false");
  }

  prefillLogin({ username, password }) {
    this.#switchTab("login");
    const loginComp = this.querySelector("user-login");
    if (loginComp && typeof loginComp.prefill === "function") {
      loginComp.prefill({ username, password });
    }
  }

  render(auth) {
    this.auth = auth;

    if (!auth || !auth.token) {
      this.innerHTML = `
        <div class="container">
          <h1>${t("welcome")}</h1>
          <p id="status" class="status" role="status" aria-live="polite" aria-atomic="true"></p>
          <div class="tabs" role="tablist" aria-label="${t("authTabs")}">
            <button class="tab-btn active" role="tab" data-tab="signup"
              aria-selected="true" aria-controls="panel-signup" id="tab-signup" tabindex="0">
              ${t("createAccount")}
            </button>
            <button class="tab-btn" role="tab" data-tab="login"
              aria-selected="false" aria-controls="panel-login" id="tab-login" tabindex="-1">
              ${t("login")}
            </button>
          </div>
          <div id="panel-signup" role="tabpanel" aria-labelledby="tab-signup" aria-hidden="false">
            <user-created></user-created>
          </div>
          <div id="panel-login" role="tabpanel" aria-labelledby="tab-login" aria-hidden="true">
            <user-login class="hidden"></user-login>
          </div>
        </div>
      `;

      this.querySelectorAll(".tab-btn").forEach(btn => {
        btn.addEventListener("click", () => this.#switchTab(btn.dataset.tab));
      });
    } else {
      this.innerHTML = `
        <div class="container">
          <h1>${t("welcomeUser", { username: auth.user?.username || "" })}</h1>
          <p id="status" class="status" role="status" aria-live="polite" aria-atomic="true"></p>
          <user-settings></user-settings>
          <button id="logoutBtn" class="btn btn-secondary">${t("logout")}</button>
        </div>
      `;

      this.querySelector("#logoutBtn").addEventListener("click", () => {
        this.dispatchEvent(new CustomEvent("logout"));
      });
    }
  }
}

customElements.define("user-app", UserApp);
