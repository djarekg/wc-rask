import { LitElement, type TemplateResult, html } from 'lit';
import './notication.css';

export class Notification extends LitElement {
  override render(): TemplateResult {
    return html`<div><slot></slot></div>`;
  }
}
