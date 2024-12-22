import {describe, expect, it } from 'bun:test';
import { assert } from '#/validation/assert.ts';

describe('assert', () => {
  it('should not throw an error when the condition is true', () => {
    expect(() => assert(true, 'This should not throw')).not.toThrow();
  });

  it('should throw an error when the condition is false', () => {
    expect(() => assert(false, 'This should throw')).toThrow('This should throw');
  });

  it('should throw an error with a default message when no message is provided', () => {
    expect(() => assert(false)).toThrow('Assertion failed');
  });
});
