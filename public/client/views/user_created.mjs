import { t } from "../i18n/translations.mjs";

class UserCreated extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <div class="card">
        <h2>${t("createAccount")}</h2>
        <form id="signupForm" novalidate>
          <div class="form-group">
            <label for="signupUsername">${t("username")}</label>
            <input type="text" id="signupUsername" name="username"
              autocomplete="username" required aria-required="true" />
          </div>
          <div class="form-group">
            <label for="signupPassword">${t("password")}</label>
            <input type="password" id="signupPassword" name="password"
              autocomplete="new-password" required aria-required="true" />
          </div>
          <div class="form-group">
            <label class="checkbox-label">
              <input type="checkbox" id="signupConsent" name="consent" required aria-required="true" />
              ${t("tosConsent", {
                tos: `<a href="./views/tos.html" target="_blank" rel="noopener">${t("termsOfService")}</a>`,
                privacy: `<a href="./views/privacy.html" target="_blank" rel="noopener">${t("privacyPolicy")}</a>`,
              })}
            </label>
          </div>
          <button type="submit" class="btn btn-primary">${t("signUp")}</button>
        </form>
      </div>
    `;

    this.querySelector("#signupForm").addEventListener("submit", (e) => {
      e.preventDefault();
      const username = this.querySelector("#signupUsername").value;
      const password = this.querySelector("#signupPassword").value;
      const accepted = this.querySelector("#signupConsent").checked;
      const consent = accepted
        ? { acceptedTos: true, acceptedPrivacy: true, version: "1.0" }
        : null;

      this.dispatchEvent(
        new CustomEvent("signup", {
          bubbles: true,
          detail: { username, password, consent },
        })
      );
    });
  }
}

customElements.define("user-created", UserCreated);
