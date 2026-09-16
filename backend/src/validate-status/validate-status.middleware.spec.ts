import { ValidateStatusMiddleware } from './validate-status.middleware.js';

describe('ValidateStatusMiddleware', () => {
  it('should be defined', () => {
    expect(new ValidateStatusMiddleware()).toBeDefined();
  });
});
