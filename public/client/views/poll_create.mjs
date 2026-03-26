import { t } from "../i18n/translations.mjs";
import { setupExpandToggle, setupAddOption } from "../utils/poll_form.mjs";

class PollCreate extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <div class="card expandable-card">
        <button type="button" class="expand-toggle" aria-expanded="false" aria-controls="pollFormBody">
          <span class="expand-toggle-label">${t("createPoll")}</span>
          <span class="expand-icon" aria-hidden="true">＋</span>
        </button>
        <div id="pollFormBody" class="expand-body" hidden>
          <form id="pollForm" novalidate>
            <div class="form-group">
              <label for="pollQuestion">${t("pollQuestion")}</label>
              <input type="text" id="pollQuestion" name="question"
                placeholder="${t("pollQuestionPlaceholder")}" required aria-required="true" />
            </div>
            <div id="optionsList">
              <div class="form-group">
                <label for="option0">${t("pollOption")} 1</label>
                <input type="text" id="option0" name="option" required aria-required="true" />
              </div>
              <div class="form-group">
                <label for="option1">${t("pollOption")} 2</label>
                <input type="text" id="option1" name="option" required aria-required="true" />
              </div>
            </div>
            <div class="form-row">
              <button type="button" id="addOptionBtn" class="btn btn-secondary">${t("addOption")}</button>
              <button type="submit" class="btn btn-primary">${t("createPoll")}</button>
            </div>
          </form>
        </div>
      </div>
    `;

    const toggle = this.querySelector(".expand-toggle");
    const body = this.querySelector("#pollFormBody");
    const icon = this.querySelector(".expand-icon");

    setupExpandToggle(toggle, body, icon, () => this.querySelector("#pollQuestion").focus());
    setupAddOption(this.querySelector("#optionsList"), this.querySelector("#addOptionBtn"), "option");

    this.querySelector("#pollForm").addEventListener("submit", (e) => {
      e.preventDefault();
      const question = this.querySelector("#pollQuestion").value.trim();
      const options = Array.from(this.querySelectorAll("#optionsList input"))
        .map((i) => i.value.trim())
        .filter(Boolean);

      this.dispatchEvent(
        new CustomEvent("createpoll", { bubbles: true, detail: { question, options } })
      );

      this.querySelector("#pollForm").reset();
  
      toggle.setAttribute("aria-expanded", "false");
      body.hidden = true;
      icon.textContent = "＋";
    });
  }
}

customElements.define("poll-create", PollCreate);
