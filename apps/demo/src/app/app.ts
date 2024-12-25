import { LitElement } from 'lit';
import './app.css';

export class App extends LitElement {}

if (!customElements.get('app-root')) {
  customElements.define('app-root', App);
}
