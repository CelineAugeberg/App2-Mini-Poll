import { t } from "../i18n/translations.mjs";
import { getPoll, votePoll, updatePoll, deletePoll } from "../controller/poll_controller.mjs";
import { setupExpandToggle, setupAddOption } from "../utils/poll_form.mjs";

class PollView extends HTMLElement {
  #poll = null;
  #voted = false;

  #isOwner() {
    return this.currentUserId != null &&
      this.#poll?.createdBy != null &&
      Number(this.currentUserId) === Number(this.#poll.createdBy);
  }

  async connectedCallback() {
    const pollId = this.dataset.pollId;

    if (this.preloadedPoll) {
      this.#poll = this.preloadedPoll;
      this.#render();
      getPoll(pollId).then((fresh) => {
        this.#poll = fresh;
        if (!this.#voted) this.#render();
      }).catch(() => {});
      return;
    }

    this.innerHTML = `<div class="container"><p>${t("loading")}</p></div>`;
    try {
      this.#poll = await getPoll(pollId);
      this.#render();
    } catch {
      this.innerHTML = `
        <div class="container">
          <p>${t("pollNotFound")}</p>
          <button class="btn btn-secondary back-btn">${t("backToApp")}</button>
        </div>`;
      this.querySelector(".back-btn").addEventListener("click", () => { location.hash = ""; });
    }
  }

  #render() {
    const p = this.#poll;
    const totalVotes = p.options.reduce((sum, o) => sum + o.votes, 0);
    const owner = this.#isOwner();

    if (this.#voted || owner) {
      const optionsInputs = p.options.map((o, i) => `
        <div class="form-group">
          <label for="editOpt${i}">${t("pollOption")} ${i + 1}</label>
          <input type="text" id="editOpt${i}" value="${o.text.replace(/"/g, "&quot;")}" />
        </div>`).join("");

      this.innerHTML = `
        <div class="container">
          <h1>${p.question}</h1>
          ${this.#voted ? `<p class="status" role="status" aria-live="polite">${t("thankYouVote")}</p>` : ""}

          <div class="results" role="list">
            ${p.options.map((o) => {
              const pct = totalVotes > 0 ? Math.round((o.votes / totalVotes) * 100) : 0;
              return `
                <div class="result-item" role="listitem">
                  <div class="result-label">${o.text}</div>
                  <div class="result-bar-wrap" aria-label="${o.votes} ${t("votes")} (${pct}%)">
                    <div class="result-bar" style="width:${pct}%"></div>
                  </div>
                  <div class="result-count">${pct}% · ${o.votes} ${t("votes")}</div>
                </div>`;
            }).join("")}
          </div>
          <p class="result-total">${t("totalVotes")}: ${totalVotes}</p>

          ${owner ? `
            <div class="owner-actions">
              <div class="card expandable-card">
                <button type="button" class="expand-toggle" aria-expanded="false" aria-controls="editFormBody">
                  <span class="expand-toggle-label">${t("editPoll")}</span>
                  <span class="expand-icon" aria-hidden="true">＋</span>
                </button>
                <div id="editFormBody" class="expand-body" hidden>
                  <form id="editForm" novalidate>
                    <div class="form-group">
                      <label for="editQuestion">${t("pollQuestion")}</label>
                      <input type="text" id="editQuestion" value="${p.question.replace(/"/g, "&quot;")}" required />
                    </div>
                    <div id="editOptionsList">
                      ${optionsInputs}
                    </div>
                    <div class="form-row">
                      <button type="button" id="addEditOptionBtn" class="btn btn-secondary">${t("addOption")}</button>
                      <button type="submit" class="btn btn-primary">${t("saveChanges")}</button>
                    </div>
                  </form>
                </div>
              </div>
              <button id="deletePollBtn" class="btn btn-danger">${t("deletePoll")}</button>
            </div>
          ` : ""}

          <button class="btn btn-secondary back-btn">${t("backToApp")}</button>
        </div>
      `;

      if (owner) this.#bindOwnerActions();
    } else {
      this.innerHTML = `
        <div class="container">
          <h1>${p.question}</h1>
          <form id="voteForm" novalidate>
            <fieldset class="options-fieldset">
              <legend class="sr-only">${t("chooseOption")}</legend>
              ${p.options.map((o, i) => `
                <label class="option-label">
                  <input type="radio" name="option" value="${i}" required />
                  ${o.text}
                </label>`).join("")}
            </fieldset>
            <button type="submit" class="btn btn-primary">${t("vote")}</button>
          </form>
          <button class="btn btn-secondary back-btn" style="margin-top:12px">${t("backToApp")}</button>
        </div>
      `;

      this.querySelector("#voteForm").addEventListener("submit", async (e) => {
        e.preventDefault();
        const selected = this.querySelector('input[name="option"]:checked');
        if (!selected) return;
        try {
          this.#poll = await votePoll(this.#poll.id, Number(selected.value));
          this.#voted = true;
          this.#render();
        } catch (err) {
          const existing = this.querySelector(".status-err");
          const el = existing || (() => {
            const node = document.createElement("p");
            node.className = "status-err status";
            node.setAttribute("role", "alert");
            this.querySelector("#voteForm").after(node);
            return node;
          })();
          el.textContent = err.message || t("couldNotVote");
        }
      });
    }

    this.querySelectorAll(".back-btn").forEach((btn) => {
      btn.addEventListener("click", () => { location.hash = ""; });
    });
  }

  #showOwnerError(msg) {
    let el = this.querySelector(".owner-status-err");
    if (!el) {
      el = document.createElement("p");
      el.className = "owner-status-err status";
      el.setAttribute("role", "alert");
      this.querySelector(".owner-actions").prepend(el);
    }
    el.textContent = msg;
  }

  #bindOwnerActions() {
    setupExpandToggle(
      this.querySelector(".expand-toggle"),
      this.querySelector("#editFormBody"),
      this.querySelector(".expand-icon"),
      () => this.querySelector("#editQuestion").focus()
    );

    setupAddOption(
      this.querySelector("#editOptionsList"),
      this.querySelector("#addEditOptionBtn"),
      "editOpt"
    );

    
    this.querySelector("#editForm").addEventListener("submit", async (e) => {
      e.preventDefault();
      const question = this.querySelector("#editQuestion").value.trim();
      const options = Array.from(this.querySelectorAll("#editOptionsList input"))
        .map((i) => i.value.trim())
        .filter(Boolean);
      try {
        this.#poll = await updatePoll(this.#poll.id, { question, options });
        this.#render();
      } catch (err) {
        this.#showOwnerError(err.message || t("couldNotUpdatePoll"));
      }
    });

    
    this.querySelector("#deletePollBtn").addEventListener("click", async () => {
      if (!confirm(t("confirmDeletePoll"))) return;
      try {
        await deletePoll(this.#poll.id);
        location.hash = "";
      } catch (err) {
        this.#showOwnerError(err.message || t("couldNotDeletePoll"));
      }
    });
  }
}

customElements.define("poll-view", PollView);
