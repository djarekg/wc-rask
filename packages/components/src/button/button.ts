import { LitElement, type TemplateResult, html } from 'lit';
import { property } from 'lit/decorators.js';
import './button.css';

export class Button extends LitElement {
  @property({ type: String }) type = 'button';

  override render(): TemplateResult {
    return html`<button><slot></slot></button>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'wc-button': Button;
  }
}

if (!customElements.get('wc-button')) {
  customElements.define('wc-button', Button);
}
