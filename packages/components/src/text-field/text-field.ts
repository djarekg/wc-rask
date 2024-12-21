import { Signal, SignalWatcher, html } from '@lit-labs/signals';
import { redispatchEvent } from '@material/web/internal/events/redispatch-event.js';
import { type CSSResult, LitElement, type PropertyValues, type TemplateResult } from 'lit';
import { property, query, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { live } from 'lit/directives/live.js';
import css from './input.css' with { type: 'css' };

/**
 * Input types that are compatible with the text field.
 */
export type TextFieldType = 'email' | 'number' | 'password' | 'search' | 'tel' | 'text' | 'url';

/**
 * Input types that are not fully supported for the text field.
 */
export type UnsupportedTextFieldType =
  | 'color'
  | 'date'
  | 'datetime-local'
  | 'file'
  | 'month'
  | 'time'
  | 'week';

/**
 * Input types that are incompatible with the text field.
 */
export type InvalidTextFieldType =
  | 'button'
  | 'checkbox'
  | 'hidden'
  | 'image'
  | 'radio'
  | 'range'
  | 'reset'
  | 'submit';

export class TextField extends SignalWatcher(LitElement) {
  static override styles: CSSResult = css;

  /**
   * The default value of the text field.
   */
  @property() defaultValue = '';

  /**
   * Whether the text field is disabled.
   */
  @property({ type: Boolean }) disabled = false;

  /**
   * The label for the text field.
   */
  @property() label?: string;

  /**
   * Whether the text field is required.
   */
  @property({ type: Boolean, reflect: true }) required = false;

  /**
   * Whether the text field has an error.
   */
  @property({ type: Boolean, reflect: true }) error = false;

  /**
   * The error text to display when there is an error.
   */
  @property() errorText = '';

  /**
   * Whether the text field is read-only.
   */
  @property({ type: Boolean, reflect: true }) readOnly = false;

  /**
   * The type of the text field.
   */
  @property({ reflect: true }) type: TextFieldType | UnsupportedTextFieldType = 'text';

  @state() protected nativeError = false;
  @state() protected nativeErrorText = '';
  @state() protected valueHasChanged = false;
  @state() protected dirty = false;
  @state() protected focused = false;
  @state() protected refreshErrorAlert = false;

  @query('input') protected readonly input?: HTMLInputElement | null;

  // FormElement
  /**
   * Gets the form element that contains the text field.
   */
  get form(): HTMLElementTagNameMap['form'] | null {
    return this.closest('form');
  }

  /**
   * Gets or sets the direction in which selection occurred.
   */
  get selectionDirection(): 'backward' | 'forward' | 'none' | null {
    return this.#getInput().selectionDirection;
  }
  set selectionDirection(value: 'backward' | 'forward' | 'none' | null) {
    this.#getInput().selectionDirection = value;
  }

  /**
   * Gets or sets the end position or offset of a text selection.
   */
  get selectionEnd(): number | null {
    return this.#getInput().selectionEnd;
  }
  set selectionEnd(value: number | null) {
    this.#getInput().selectionEnd = value;
  }

  /**
   * Gets or sets the starting position or offset of a text selection.
   */
  get selectionStart(): number | null {
    return this.#getInput().selectionStart;
  }
  set selectionStart(value: number | null) {
    this.#getInput().selectionStart = value;
  }

  /**
   * Returns the native validation error message that would be displayed upon
   * calling `reportValidity()`.
   *
   * https://developer.mozilla.org/en-US/docs/Web/API/HTMLObjectElement/validationMessage
   */
  get validationMessage(): string {
    return this.#getInput().validationMessage;
  }

  /**
   * Returns a ValidityState object that represents the validity states of the
   * text field.
   *
   * https://developer.mozilla.org/en-US/docs/Web/API/HTMLObjectElement/validity
   */
  get validity(): ValidityState {
    return this.#getInput().validity;
  }

  /**
   * The text field's value as a number.
   */
  get valueAsNumber(): number {
    return this.#getInput().valueAsNumber;
  }
  set valueAsNumber(value: number) {
    this.#getInput().valueAsNumber = value;
    this.#value.set(this.#getInput().value);
  }

  /**
   * The text field's value as a Date.
   */
  get valueAsDate(): Date {
    return this.#getInput().valueAsDate;
  }
  set valueAsDate(value: Date | null) {
    this.#getInput().valueAsDate = value;
    this.#value.set(this.#getInput().value);
  }

  get #hasError(): boolean {
    return this.#hasError || this.nativeError;
  }

  #ignoreNextValueChange = false;

  accessor #value = new Signal.State('');

  reportValidity(): boolean {
    const { valid, canceled } = this.#checkValidityAndDispatch();
    if (!canceled) {
      const prevMessage = this.#getErrorText();
      this.nativeError = !valid;
      this.nativeErrorText = this.validationMessage;

      const needsRefresh = this.#shouldErrorAnnounce() && prevMessage === this.#getErrorText();
      if (needsRefresh) {
        this.refreshErrorAlert = true;
      }
    }

    return valid;
  }

  /**
   * Selects the text in the text field.
   */
  select(): void {
    this.#getInput().select();
  }

  /**
   * Sets a custom validity message for the text field.
   * @param error The custom error message.
   */
  setCustomValidity(error: string): void {
    this.#getInput().setCustomValidity(error);
  }

  /**
   * Sets the range of text to be replaced by the given string.
   * @param replacement The string to replace the range of text with.
   */
  setRangeText(replacement: string): void;
  setRangeText(
    replacement: string,
    start: number,
    end: number,
    selectionMode?: SelectionMode,
  ): void;
  setRangeText(...args: unknown[]): void {
    this.#getInput().setRangeText(...(args as Parameters<HTMLInputElement['setRangeText']>));
    this.#value.set(this.#getInput().value);
  }

  /**
   * Sets the start and end positions of the text selection.
   * @param start The start position of the selection.
   * @param end The end position of the selection.
   * @param direction The direction in which the selection occurred.
   */
  setSelectionRange(
    start: number | null,
    end: number | null,
    direction?: 'forward' | 'backward' | 'none',
  ): void {
    this.#getInput().setSelectionRange(start ?? 0, end ?? 0, direction);
  }

  /**
   * Resets the text field to its default value.
   */
  reset(): void {
    this.dirty = false;
    this.valueHasChanged = false;
    this.#ignoreNextValueChange = true;
    this.#value.set(this.defaultValue);
    this.nativeError = false;
    this.nativeErrorText = '';
  }

  protected override update(changedProperties: PropertyValues): void {
    const valueHasChanged =
      changedProperties.has('value') && changedProperties.get('value') !== undefined;

    if (valueHasChanged && !this.#ignoreNextValueChange) {
      this.valueHasChanged = true;
    }

    if (this.#ignoreNextValueChange) {
      this.#ignoreNextValueChange = false;
    }

    super.update(changedProperties);
  }

  protected override updated(): void {
    const value = this.#getInput().value;

    if (this.#value.get() !== value) {
      this.#ignoreNextValueChange = true;
      this.#value.set(value);
    }

    if (this.refreshErrorAlert) {
      requestAnimationFrame(() => {
        this.refreshErrorAlert = false;
      });
    }
  }

  /**
   * Renders the text field.
   */
  override render(): TemplateResult {
    const classes = {
      disabled: this.disabled,
      populated: true,
    };

    return html`
      <div class="wc-text-field ${classMap(classes)}">
        ${this.#renderInput()}
        <label>${this.label}</label>
      </div>
      `;
  }

  /**
   * Renders the input element for the text field.
   */
  #renderInput(): TemplateResult {
    return html`
      <input
        .value=${live(this.#getInputValue())}
        ?disabled=${this.disabled}
        ?readonly=${this.readOnly}
        ?required=${this.required}
        @input=${this.#handleInput}
        @select=${this.#redispatchEvent}
      />
    `;
  }

  /**
   * Gets the current value of the input element.
   */
  #getInputValue(): string {
    const alwaysShowValue = this.dirty || this.valueHasChanged;

    if (alwaysShowValue) {
      return this.#value.get();
    }

    return this.defaultValue ?? this.#value.get();
  }

  /**
   * Gets the error text to display.
   */
  #getErrorText(): string {
    return this.error ? this.errorText : this.nativeErrorText;
  }

  /**
   * Determines whether the error should be announced.
   */
  #shouldErrorAnnounce(): boolean {
    // Announce if there is an error and error text visible.
    // If refreshErrorAlert is true, do not announce. This will remove the
    // role="alert" attribute. Another render cycle will happen after an
    // animation frame to re-add the role.
    return this.#hasError && !!this.#getErrorText() && !this.refreshErrorAlert;
  }

  /**
   * Handles the focusin event.
   */
  #handleFocusin(): void {
    this.focused = true;
  }

  /**
   * Handles the focusout event.
   */
  #handleFocusout(): void {
    if (this.matches(':focus-within')) {
      // Changing focus to another child within the text field, like a button
      return;
    }

    this.focused = false;
  }

  /**
   * Handles the input event.
   * @param e The input event.
   */
  #handleInput(e: InputEvent): void {
    this.dirty = true;
    this.#value.set((e.target as HTMLInputElement).value);
    this.#redispatchEvent(e);
  }

  /**
   * Redispatches the event.
   * @param e The event to redispatch.
   */
  #redispatchEvent(e: Event): void {
    redispatchEvent(this, e);
  }

  /**
   * Gets the input element.
   */
  #getInput(): HTMLInputElement {
    if (!this.input) {
      this.connectedCallback();
      this.scheduleUpdate();
    }

    if (this.isUpdatePending) {
      this.scheduleUpdate();
    }

    return this.input!;
  }

  /**
   * Checks the validity of the input and dispatches an invalid event if necessary.
   */
  #checkValidityAndDispatch(): { valid: boolean; canceled: boolean } {
    const valid = this.#getInput().checkValidity();
    let canceled = false;

    if (!valid) {
      canceled = !this.dispatchEvent(new Event('invalid', { cancelable: true }));
    }

    return { valid, canceled };
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'wc-text-field': TextField;
  }
}

if (!customElements.get('wc-text-field')) {
  customElements.define('wc-text-field', TextField);
}
