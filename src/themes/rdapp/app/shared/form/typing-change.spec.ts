import {
  fakeAsync,
  tick,
} from '@angular/core/testing';

import {
  attachTypingChange,
  isPlainTextControl,
  TYPING_CHANGE_DEBOUNCE_MS,
} from './typing-change';

describe('typing-change', () => {
  let host: HTMLElement;
  let detach: () => void;
  let changes: EventTarget[];

  const onChange = (event: Event) => changes.push(event.target);

  /** Cria um campo dentro (ou fora) de uma seção do formulário de submissão. */
  function create(markup: string, insideSection = true): HTMLInputElement | HTMLTextAreaElement {
    host.innerHTML = insideSection
      ? `<ds-submission-section-form>${markup}</ds-submission-section-form>`
      : markup;
    return host.querySelector('input, textarea');
  }

  function type(field: HTMLElement) {
    field.dispatchEvent(new Event('input', { bubbles: true }));
  }

  beforeEach(() => {
    host = document.createElement('div');
    document.body.appendChild(host);
    changes = [];
    document.addEventListener('change', onChange, true);
    detach = attachTypingChange(document);
  });

  afterEach(() => {
    detach();
    document.removeEventListener('change', onChange, true);
    host.remove();
  });

  it('dispara change depois da pausa na digitação, em campo de texto da seção', fakeAsync(() => {
    const field = create('<input type="text">');
    type(field);
    tick(TYPING_CHANGE_DEBOUNCE_MS - 1);
    expect(changes.length).toBe(0);
    tick(1);
    expect(changes).toEqual([field]);
  }));

  it('dispara change em área de texto da seção', fakeAsync(() => {
    const field = create('<textarea></textarea>');
    type(field);
    tick(TYPING_CHANGE_DEBOUNCE_MS);
    expect(changes).toEqual([field]);
  }));

  it('junta a digitação contínua em um único change', fakeAsync(() => {
    const field = create('<input type="text">');
    type(field);
    tick(TYPING_CHANGE_DEBOUNCE_MS - 100);
    type(field);
    tick(TYPING_CHANGE_DEBOUNCE_MS - 100);
    expect(changes.length).toBe(0);
    tick(100);
    expect(changes).toEqual([field]);
  }));

  it('não dispara change em campo fora do formulário de submissão', fakeAsync(() => {
    const field = create('<input type="text">', false);
    type(field);
    tick(TYPING_CHANGE_DEBOUNCE_MS * 2);
    expect(changes.length).toBe(0);
  }));

  it('não dispara change em campo de busca com sugestão', fakeAsync(() => {
    const combobox = create('<input type="text" role="combobox">');
    type(combobox);
    const autocomplete = create('<input type="text" aria-autocomplete="list">');
    type(autocomplete);
    tick(TYPING_CHANGE_DEBOUNCE_MS * 2);
    expect(changes.length).toBe(0);
  }));

  it('não dispara change em campo somente leitura, desabilitado ou de outro tipo', fakeAsync(() => {
    for (const markup of ['<input type="text" readonly>', '<input type="text" disabled>', '<input type="checkbox">',
      '<input type="number">']) {
      type(create(markup));
    }
    tick(TYPING_CHANGE_DEBOUNCE_MS * 2);
    expect(changes.length).toBe(0);
  }));

  it('para de agir depois de desligado', fakeAsync(() => {
    const field = create('<input type="text">');
    detach();
    type(field);
    tick(TYPING_CHANGE_DEBOUNCE_MS * 2);
    expect(changes.length).toBe(0);
  }));

  describe('isPlainTextControl', () => {
    it('recusa alvos que não são campos', () => {
      expect(isPlainTextControl(null)).toBeFalse();
      expect(isPlainTextControl(document.createElement('div'))).toBeFalse();
    });

    it('aceita campo de texto dentro da seção', () => {
      expect(isPlainTextControl(create('<input type="text">'))).toBeTrue();
    });
  });
});
