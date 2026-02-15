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

  prefillLogin({ username, password }) {
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
          <h2>Welcome to Mini Poll</h2>
          <p id="status" class="status"></p>
          <user-created></user-created>
          <user-login></user-login>
        </div>
      `;
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
