import {
  readStored,
  removeStored,
  writeStored,
} from './ai-summary.storage';

describe('ai-summary.storage', () => {

  const key = 'evidencia.ai-summary.test';

  beforeEach(() => sessionStorage.removeItem(key));

  it('guarda e lê de volta um valor em JSON', () => {
    writeStored(key, { a: 1, b: ['x'] });

    expect(readStored(key)).toEqual({ a: 1, b: ['x'] });
  });

  it('devolve null quando não há nada guardado', () => {
    expect(readStored(key)).toBeNull();
  });

  it('devolve null em vez de lançar quando o valor não é JSON', () => {
    sessionStorage.setItem(key, '{quebrado');

    expect(readStored(key)).toBeNull();
  });

  it('remove o valor guardado', () => {
    writeStored(key, 'x');
    removeStored(key);

    expect(sessionStorage.getItem(key)).toBeNull();
  });

  it('não lança quando o armazenamento recusa a escrita', () => {
    spyOn(Storage.prototype, 'setItem').and.throwError('QuotaExceededError');

    expect(() => writeStored(key, 'x')).not.toThrow();
  });
});
