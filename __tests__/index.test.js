const { greet } = require('../index');

describe('greet function', () => {
  test('should return a greeting message', () => {
    expect(greet('World')).toBe('Hello, World!');
  });

  test('should handle empty name', () => {
    expect(greet('')).toBe('Hello, !');
  });
});