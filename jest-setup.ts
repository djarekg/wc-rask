import '@testing-library/jest-dom/extend-expect';
import { configure } from '@testing-library/dom';

configure({ testIdAttribute: 'data-test-id' });

// Import LitElement and other necessary polyfills
import 'lit/polyfill-support.js';
import 'lit/polyfills/custom-elements.js';
import 'lit/polyfills/shady-render.js';
