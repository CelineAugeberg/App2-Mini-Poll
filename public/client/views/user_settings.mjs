class UserSettings extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <div class="card">
        <h3>Account Settings</h3>

        <div class="settings-section">
          <h4>Change Password</h4>
          <form id="changePasswordForm">
            <div class="form-group">
              <label for="newPassword">New Password:</label>
              <input type="password" id="newPassword" name="newPassword" required />
            </div>
            <div class="form-group">
              <label for="confirmPassword">Confirm Password:</label>
              <input type="password" id="confirmPassword" name="confirmPassword" required />
            </div>
            <button type="submit" class="btn btn-primary">Update Password</button>
          </form>
        </div>

        <div class="settings-section">
          <h4>Delete Account</h4>
          <p>Warning: This action cannot be undone.</p>
          <button id="deleteAccountBtn" class="btn btn-danger">Delete Account</button>
        </div>
      </div>
    `;

    const changePasswordForm = this.querySelector("#changePasswordForm");
    changePasswordForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const newPassword = this.querySelector("#newPassword").value;
      const confirmPassword = this.querySelector("#confirmPassword").value;

      if (newPassword !== confirmPassword) {
        alert("Passwords do not match!");
        return;
      }

      this.dispatchEvent(
        new CustomEvent("updatepassword", {
          bubbles: true,
          detail: { newPassword },
        })
      );

      changePasswordForm.reset();
    });

    const deleteBtn = this.querySelector("#deleteAccountBtn");
    deleteBtn.addEventListener("click", () => {
      this.dispatchEvent(
        new CustomEvent("deleteaccount", {
          bubbles: true,
        })
      );
    });
  }
}

customElements.define("user-settings", UserSettings);
