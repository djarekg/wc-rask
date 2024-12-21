import { LitElement } from 'lit';
import css from './index.css' with { type: 'css' };

export class App extends LitElement {
  static override styles = [css];
}

if (!customElements.get('app-root')) {
  customElements.define('app-root', App);
}
