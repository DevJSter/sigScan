import { generateFunctionSelector, shouldIncludeFunction, formatTimestamp } from '../utils/helpers';

describe('Helper Functions', () => {
  describe('generateFunctionSelector', () => {
    it('should generate correct function selectors', () => {
      expect(generateFunctionSelector('transfer(address,uint256)')).toBe('0xa9059cbb');
      expect(generateFunctionSelector('approve(address,uint256)')).toBe('0x095ea7b3');
      expect(generateFunctionSelector('balanceOf(address)')).toBe('0x70a08231');
    });

    it('should handle empty signature', () => {
      expect(generateFunctionSelector('')).toBe('0xc5d24601');
    });
  });

  describe('shouldIncludeFunction', () => {
    it('should include public functions by default', () => {
      expect(shouldIncludeFunction('public')).toBe(true);
      expect(shouldIncludeFunction('external')).toBe(true);
    });

    it('should exclude internal functions by default', () => {
      expect(shouldIncludeFunction('internal')).toBe(false);
      expect(shouldIncludeFunction('private')).toBe(false);
    });

    it('should include internal functions when specified', () => {
      expect(shouldIncludeFunction('internal', true)).toBe(true);
    });

    it('should include private functions when specified', () => {
      expect(shouldIncludeFunction('private', false, true)).toBe(true);
    });
  });

  describe('formatTimestamp', () => {
    it('should format timestamp correctly', () => {
      const timestamp = new Date('2023-01-01T12:00:00.000Z');
      const formatted = formatTimestamp(timestamp);
      expect(formatted).toBe('2023-01-01T12-00-00');
    });
  });
});
