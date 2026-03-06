import { t } from "../i18n/translations.mjs";

class UserSettings extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <div class="card">
        <h2>${t("accountSettings")}</h2>

        <div class="settings-section">
          <h3>${t("changePassword")}</h3>
          <form id="changePasswordForm" novalidate>
            <div class="form-group">
              <label for="newPassword">${t("newPassword")}</label>
              <input type="password" id="newPassword" name="newPassword"
                autocomplete="new-password" required aria-required="true" />
            </div>
            <div class="form-group">
              <label for="confirmPassword">${t("confirmPassword")}</label>
              <input type="password" id="confirmPassword" name="confirmPassword"
                autocomplete="new-password" required aria-required="true" />
            </div>
            <button type="submit" class="btn btn-primary">${t("updatePassword")}</button>
          </form>
        </div>

        <div class="settings-section">
          <h3>${t("deleteAccount")}</h3>
          <p class="danger-text">${t("deleteWarning")}</p>
          <button id="deleteAccountBtn" class="btn btn-danger">${t("deleteAccount")}</button>
        </div>
      </div>
    `;

    this.querySelector("#changePasswordForm").addEventListener("submit", (e) => {
      e.preventDefault();
      const newPassword = this.querySelector("#newPassword").value;
      const confirmPassword = this.querySelector("#confirmPassword").value;

      if (newPassword !== confirmPassword) {
        this.dispatchEvent(
          new CustomEvent("statusmessage", {
            bubbles: true,
            detail: { message: t("passwordMismatch") },
          })
        );
        return;
      }

      this.dispatchEvent(
        new CustomEvent("updatepassword", {
          bubbles: true,
          detail: { newPassword },
        })
      );

      this.querySelector("#changePasswordForm").reset();
    });

    this.querySelector("#deleteAccountBtn").addEventListener("click", () => {
      this.dispatchEvent(new CustomEvent("deleteaccount", { bubbles: true }));
    });
  }
}

customElements.define("user-settings", UserSettings);
