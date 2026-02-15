class UserLogin extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <div class="card">
        <h3>Login</h3>
        <form id="loginForm">
          <div class="form-group">
            <label for="loginUsername">Username:</label>
            <input type="text" id="loginUsername" name="username" required />
          </div>
          <div class="form-group">
            <label for="loginPassword">Password:</label>
            <input type="password" id="loginPassword" name="password" required />
          </div>
          <button type="submit" class="btn btn-primary">Login</button>
        </form>
      </div>
    `;

    const form = this.querySelector("#loginForm");
    form.addEventListener("submit", (e) => {
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
    const usernameInput = this.querySelector("#loginUsername");
    const passwordInput = this.querySelector("#loginPassword");
    if (usernameInput) usernameInput.value = username || "";
    if (passwordInput) passwordInput.value = password || "";
  }
}

customElements.define("user-login", UserLogin);
