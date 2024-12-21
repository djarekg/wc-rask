import { type CSSResult, LitElement } from 'lit';
import css from './app.css' with { type: 'css' };

export class App extends LitElement {
  static override styles: CSSResult = css;
}

if (!customElements.get('app-root')) {
  customElements.define('app-root', App);
}
