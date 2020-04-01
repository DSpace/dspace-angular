import { getUrlWithoutEmbedParams } from './index.selectors';

describe(`index selectors`, () => {

  describe(`getUrlWithoutEmbedParams`, () => {

    it(`should return a url without its embed params`, () => {
      const source = 'https://rest.api/resource?a=1&embed=2&b=3&embed=4/5&c=6&embed=7/8/9';
      const result = getUrlWithoutEmbedParams(source);
      expect(result).toBe('https://rest.api/resource?a=1&b=3&c=6');
    });

    it(`should return a url without embed params unmodified`, () => {
      const source = 'https://rest.api/resource?a=1&b=3&c=6';
      const result = getUrlWithoutEmbedParams(source);
      expect(result).toBe(source);
    });

    it(`should return a string that isn't a url unmodified`, () => {
      const source = 'a=1&embed=2&b=3&embed=4/5&c=6&embed=7/8/9';
      const result = getUrlWithoutEmbedParams(source);
      expect(result).toBe(source);
    });

    it(`should return undefined or null unmodified`, () => {
      expect(getUrlWithoutEmbedParams(undefined)).toBe(undefined);
      expect(getUrlWithoutEmbedParams(null)).toBe(null);
    });

  });

});
