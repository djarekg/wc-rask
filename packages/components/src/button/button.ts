import { type CSSResult, LitElement, type TemplateResult, html } from 'lit';
import { property } from 'lit/decorators.js';
import css from './button.css' with { type: 'css' };

export class Button extends LitElement {
  static override styles: CSSResult = css;

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
