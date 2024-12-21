import { Router } from '@lit-labs/router';
import { type CSSResult, LitElement, type TemplateResult, html } from 'lit';
import css from './index.css' with { type: 'css' };
import { routes } from './router/index.js';

export class Index extends LitElement {
  static override styles: CSSResult = css;

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
