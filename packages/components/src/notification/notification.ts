import { type CSSResult, LitElement, type TemplateResult, html } from 'lit';
import css from './notication.css' with { type: 'css' };

export class Notification extends LitElement {
  static override styles: CSSResult = css;

  override render(): TemplateResult {
    return html`<div><slot></slot></div>`;
  }
}
