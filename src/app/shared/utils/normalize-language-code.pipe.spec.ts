import { NormalizeLanguageCodePipe } from './normalize-language-code.pipe';

describe('NormalizeLanguageCodePipe', () => {
  const pipe = new NormalizeLanguageCodePipe();

  it('transforms language codes replacing underscores with dashes', () => {
    expect(pipe.transform('en_US')).toBe('en-US');
    expect(pipe.transform('pt_BR')).toBe('pt-BR');
    expect(pipe.transform('zh_Hant_TW')).toBe('zh-Hant-TW');
  });

  it('returns the same value when there are no underscores', () => {
    expect(pipe.transform('en')).toBe('en');
    expect(pipe.transform('fr')).toBe('fr');
  });

  it('preserves null and undefined input', () => {
    expect(pipe.transform(null)).toBeNull();
    expect(pipe.transform(undefined)).toBeUndefined();
  });

  it('handles empty string input', () => {
    expect(pipe.transform('')).toBe('');
  });
});
