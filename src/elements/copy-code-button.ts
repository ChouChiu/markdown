/**
 * <copy-code-button> — framework-agnostic copy-to-clipboard button.
 *
 * Usage: <copy-code-button data-code="your code here"></copy-code-button>
 *
 * Auto-registers as a Custom Element. Import this module as a side-effect.
 */

const COPY_ICON = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>`;

const CHECK_ICON = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`;

const STYLES = `
:host {
  display: inline-flex;
}
.copy-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  line-height: 1rem;
  color: inherit;
  background: transparent;
  border: none;
  cursor: pointer;
  transition: background-color 0.15s, color 0.15s;
  font-family: inherit;
}
.copy-btn:hover {
  background: rgba(255,255,255,0.1);
  color: #fff;
}
.copy-btn .icon {
  display: inline-flex;
  align-items: center;
}
`;

export class CopyCodeButton extends HTMLElement {
	private _timer: ReturnType<typeof setTimeout> | null = null;

	static register(tagName = "copy-code-button"): void {
		if (!customElements.get(tagName)) {
			customElements.define(tagName, CopyCodeButton);
		}
	}

	connectedCallback(): void {
		const shadow = this.attachShadow({ mode: "open" });

		const style = document.createElement("style");
		style.textContent = STYLES;

		const button = document.createElement("button");
		button.className = "copy-btn";
		button.setAttribute("aria-label", "Copy code");
		button.innerHTML = `<span class="icon">${COPY_ICON}</span><span>Copy</span>`;

		button.addEventListener("click", () => {
			const code = this.getAttribute("data-code") || "";
			navigator.clipboard
				.writeText(code)
				.then(() => {
					button.innerHTML = `<span class="icon">${CHECK_ICON}</span><span>Copied!</span>`;
					if (this._timer) clearTimeout(this._timer);
					this._timer = setTimeout(() => {
						button.innerHTML = `<span class="icon">${COPY_ICON}</span><span>Copy</span>`;
					}, 2000);
				})
				.catch(() => {
					// Clipboard API unavailable
				});
		});

		shadow.appendChild(style);
		shadow.appendChild(button);
	}

	disconnectedCallback(): void {
		if (this._timer) clearTimeout(this._timer);
	}
}

// Auto-register on import
CopyCodeButton.register();
