import { Router } from '@lit-labs/router';
import { LitElement, type TemplateResult, html } from 'lit';
import './index.css';
import { routes } from './router/index.js';

export class Index extends LitElement {
  readonly #router = new Router(this, routes);

  protected override render(): TemplateResult {
    return html`
      <main role="main">
        <article>${this.#router.outlet()}</article>
        </main>
    `;
  }
}

if (!customElements.get('app-index')) {
  customElements.define('app-index', Index);
}
