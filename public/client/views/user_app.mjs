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
      btn.classList.toggle("active", btn.dataset.tab === tab);
    });
    this.querySelector("user-created").classList.toggle("hidden", tab !== "signup");
    this.querySelector("user-login").classList.toggle("hidden", tab !== "login");
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
          <h2>Mini Poll</h2>
          <p id="status" class="status"></p>
          <div class="tabs">
            <button class="tab-btn active" data-tab="signup">Create Account</button>
            <button class="tab-btn" data-tab="login">Login</button>
          </div>
          <user-created></user-created>
          <user-login class="hidden"></user-login>
        </div>
      `;

      this.querySelectorAll(".tab-btn").forEach(btn => {
        btn.addEventListener("click", () => this.#switchTab(btn.dataset.tab));
      });
    } else {
      this.innerHTML = `
        <div class="container">
          <h2>Welcome, ${auth.user?.username || "User"}!</h2>
          <p id="status" class="status"></p>
          <user-settings></user-settings>
          <button id="logoutBtn" class="btn btn-secondary">Logout</button>
        </div>
      `;

      const logoutBtn = this.querySelector("#logoutBtn");
      if (logoutBtn) {
        logoutBtn.addEventListener("click", () => {
          this.dispatchEvent(new CustomEvent("logout"));
        });
      }
    }
  }
}

customElements.define("user-app", UserApp);
