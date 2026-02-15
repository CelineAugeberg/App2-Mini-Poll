class UserCreated extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <div class="card">
        <h3>Create Account</h3>
        <form id="signupForm">
          <div class="form-group">
            <label for="signupUsername">Username:</label>
            <input type="text" id="signupUsername" name="username" required />
          </div>
          <div class="form-group">
            <label for="signupPassword">Password:</label>
            <input type="password" id="signupPassword" name="password" required />
          </div>
          <div class="form-group">
            <label>
              <input type="checkbox" id="signupConsent" name="consent" required />
              I accept the <a href="./views/tos.html" target="_blank">Terms of Service</a> and
              <a href="./views/privacy.html" target="_blank">Privacy Policy</a>
            </label>
          </div>
          <button type="submit" class="btn btn-primary">Sign Up</button>
        </form>
      </div>
    `;

    const form = this.querySelector("#signupForm");
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const username = this.querySelector("#signupUsername").value;
      const password = this.querySelector("#signupPassword").value;
      const consent = this.querySelector("#signupConsent").checked;

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
