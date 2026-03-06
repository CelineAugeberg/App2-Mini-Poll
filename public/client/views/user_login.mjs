import { t } from "../i18n/translations.mjs";

class UserLogin extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <div class="card">
        <h2>${t("login")}</h2>
        <form id="loginForm" novalidate>
          <div class="form-group">
            <label for="loginUsername">${t("username")}</label>
            <input type="text" id="loginUsername" name="username"
              autocomplete="username" required aria-required="true" />
          </div>
          <div class="form-group">
            <label for="loginPassword">${t("password")}</label>
            <input type="password" id="loginPassword" name="password"
              autocomplete="current-password" required aria-required="true" />
          </div>
          <button type="submit" class="btn btn-primary">${t("login")}</button>
        </form>
      </div>
    `;

    this.querySelector("#loginForm").addEventListener("submit", (e) => {
      e.preventDefault();
      const username = this.querySelector("#loginUsername").value;
      const password = this.querySelector("#loginPassword").value;

      this.dispatchEvent(
        new CustomEvent("login", {
          bubbles: true,
          detail: { username, password },
        })
      );
    });
  }

  prefill({ username, password }) {
    const u = this.querySelector("#loginUsername");
    const p = this.querySelector("#loginPassword");
    if (u) u.value = username || "";
    if (p) p.value = password || "";
  }
}

customElements.define("user-login", UserLogin);
