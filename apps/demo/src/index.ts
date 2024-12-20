import { LitElement } from 'lit';
import { Router } from '@lit-labs/router';
import routes from './router/routes.ts';

export class Index extends LitElement {

  readonly #router = new Router(this, routes);
}
