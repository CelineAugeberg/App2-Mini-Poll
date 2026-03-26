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

  render(auth, polls = []) {
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
      const pollsHtml = polls.length === 0
        ? `<p class="no-polls">${t("noPolls")}</p>`
        : polls.map((p) => {
            const total = p.options.reduce((s, o) => s + o.votes, 0);
            const link = `${location.origin}/#poll/${p.id}`;
            return `
              <div class="poll-item">
                <span class="poll-question">${p.question}</span>
                <span class="poll-votes">${total} ${t("votes")}</span>
                <div class="poll-actions">
                  <a href="#poll/${p.id}" class="poll-link">${t("viewPoll")}</a>
                  <button class="btn-copy" data-link="${link}" aria-label="${t("copyLink")}">${t("copyLink")}</button>
                </div>
              </div>`;
          }).join("");

      this.innerHTML = `
        <div class="container container--wide">
          <div class="dashboard-header">
            <h1>${t("welcomeUser", { username: auth.user?.username || "" })}</h1>
            <button id="logoutBtn" class="btn btn-secondary">${t("logout")}</button>
          </div>
          <p id="status" class="status" role="status" aria-live="polite" aria-atomic="true"></p>
          <div class="dashboard-grid">
            <div class="dashboard-left">
              <poll-create></poll-create>
              <user-settings></user-settings>
            </div>
            <div class="dashboard-right">
              <section class="polls-section" aria-label="${t("myPolls")}">
                <h2>${t("myPolls")}</h2>
                ${pollsHtml}
              </section>
            </div>
          </div>
        </div>
      `;

      this.querySelector("#logoutBtn").addEventListener("click", () => {
        this.dispatchEvent(new CustomEvent("logout", { bubbles: true }));
      });

      this.querySelectorAll(".btn-copy").forEach((btn) => {
        btn.addEventListener("click", () => {
          navigator.clipboard.writeText(btn.dataset.link).then(() => {
            btn.textContent = t("copied");
            setTimeout(() => { btn.textContent = t("copyLink"); }, 1500);
          });
        });
      });
    }
  }
}

customElements.define("user-app", UserApp);
