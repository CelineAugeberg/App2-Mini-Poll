import { t } from "../i18n/translations.mjs";

export const MAX_OPTIONS = 6;

/**
 * Wires up an expand/collapse toggle button.
 * @param {HTMLElement} toggle   
 * @param {HTMLElement} body    
 * @param {HTMLElement} icon     
 * @param {Function}    onOpen   
 */
export function setupExpandToggle(toggle, body, icon, onOpen) {
  toggle.addEventListener("click", () => {
    const open = toggle.getAttribute("aria-expanded") === "true";
    toggle.setAttribute("aria-expanded", open ? "false" : "true");
    body.hidden = open;
    icon.textContent = open ? "＋" : "－";
    if (!open && onOpen) onOpen();
  });
}

/**
 * Wires up an "add option" button that appends new text inputs to a list container.
 * @param {HTMLElement} list   
 * @param {HTMLElement} button 
 * @param {string}      prefix 
 */
export function setupAddOption(list, button, prefix) {
  button.addEventListener("click", () => {
    const count = list.querySelectorAll("input").length;
    if (count >= MAX_OPTIONS) return;
    const div = document.createElement("div");
    div.className = "form-group";
    div.innerHTML = `
      <label for="${prefix}${count}">${t("pollOption")} ${count + 1}</label>
      <input type="text" id="${prefix}${count}" />
    `;
    list.appendChild(div);
  });
}
