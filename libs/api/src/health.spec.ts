import { describe, expect, it } from 'vitest';

import {
  InvalidHealthResponseError,
  parseHealthResponse,
} from './health';

const invalidResponses: readonly (readonly [string, unknown])[] = [
  ['null', null],
  ['undefined', undefined],
  ['boolean', true],
  ['number', 1],
  ['bigint', 1n],
  ['symbol', Symbol('ok')],
  ['string', 'ok'],
  ['function', () => ({ status: 'ok' })],
  ['empty array', []],
  ['array containing a valid body', [{ status: 'ok' }]],
  ['array with a status property', Object.assign([], { status: 'ok' })],
  ['empty object', {}],
  ['missing status', { state: 'ok' }],
  ['null status', { status: null }],
  ['undefined status', { status: undefined }],
  ['numeric status', { status: 1 }],
  ['boolean status', { status: true }],
  ['nested status', { status: { value: 'ok' } }],
  ['wrong-case status', { status: 'OK' }],
  ['padded status', { status: ' ok ' }],
  ['unexpected status', { status: 'unexpected' }],
];

function captureError(action: () => unknown): unknown {
  try {
    action();
  } catch (error: unknown) {
    return error;
  }

  throw new Error('Expected the action to throw.');
}

describe('parseHealthResponse', () => {
  it('parses a valid health response', () => {
    expect(parseHealthResponse({ status: 'ok' })).toStrictEqual({
      status: 'ok',
    });
  });

  it('returns a new object containing only contract fields', () => {
    const input = {
      status: 'ok',
      unexpected: 'value',
    };

    const result = parseHealthResponse(input);

    expect(result).not.toBe(input);
    expect(Object.keys(result)).toEqual(['status']);
    expect(result).toStrictEqual({
      status: 'ok',
    });
  });

  it.each(invalidResponses)('rejects %s', (_label, value) => {
    expect(() => parseHealthResponse(value)).toThrow(
      InvalidHealthResponseError,
    );
  });

  it('throws a stable error without echoing untrusted input', () => {
    const untrusted = 'secret-token-value';

    const error = captureError(() =>
      parseHealthResponse({
        status: untrusted,
      }),
    );

    expect(error).toBeInstanceOf(InvalidHealthResponseError);
    expect(error).toBeInstanceOf(Error);
    expect(error).toHaveProperty('name', 'InvalidHealthResponseError');
    expect(error).toHaveProperty('message', 'Response could not be parsed.');
    expect(String(error)).not.toContain(untrusted);
  });
});
