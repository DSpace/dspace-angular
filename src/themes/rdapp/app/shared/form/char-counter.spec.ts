import {
  fakeAsync,
  tick,
} from '@angular/core/testing';

import {
  attachCharCounter,
  CHAR_COUNTER_CLASS,
  CHAR_COUNTER_REDRAW_MS,
  readCharLimit,
} from './char-counter';

describe('char-counter', () => {
  let host: HTMLElement;
  let detach: () => void;

  /** Monta um controle do formulário de submissão com a dica informada. */
  function create(hint: string | null, control = '<input type="text">', insideSection = true) {
    const hintMarkup = hint === null ? '' : `<small class="text-muted ds-hint">${hint}</small>`;
    const controlMarkup = `<ds-dynamic-form-control-container><div>${control}</div>${hintMarkup}</ds-dynamic-form-control-container>`;
    host.innerHTML = insideSection ? `<ds-submission-section-form>${controlMarkup}</ds-submission-section-form>` : controlMarkup;
    return host.querySelector('input, textarea') as HTMLInputElement | HTMLTextAreaElement;
  }

  const counterOf = (field: HTMLElement) => field.nextElementSibling as HTMLElement;

  function type(field: HTMLInputElement | HTMLTextAreaElement, value: string) {
    field.value = value;
    field.dispatchEvent(new Event('input', { bubbles: true }));
  }

  beforeEach(() => {
    host = document.createElement('div');
    document.body.appendChild(host);
    detach = attachCharCounter(document);
  });

  afterEach(() => {
    detach();
    host.remove();
  });

  describe('readCharLimit', () => {
    it('lê o limite da dica do campo', () => {
      expect(readCharLimit(create('Informe o título. Limite de 300 caracteres.'))).toBe(300);
    });

    it('aceita ponto de milhar', () => {
      expect(readCharLimit(create('Limite de 2.000 caracteres.'))).toBe(2000);
    });

    it('lê o limite de dica "por termo"', () => {
      expect(readCharLimit(create('Informe termos. Limite de 300 caracteres por termo.'))).toBe(300);
    });

    it('devolve nulo sem dica ou com dica sem limite', () => {
      expect(readCharLimit(create(null))).toBeNull();
      expect(readCharLimit(create('Selecione o tipo principal do documento.'))).toBeNull();
    });
  });

  it('mostra o contador ao dar foco no campo', () => {
    const field = create('Limite de 300 caracteres.');
    field.value = 'abc';
    field.dispatchEvent(new Event('focusin', { bubbles: true }));
    expect(counterOf(field).classList).toContain(CHAR_COUNTER_CLASS);
    expect(counterOf(field).textContent).toBe('3 / 300');
  });

  it('atualiza o contador a cada digitação, sem criar outro', () => {
    const field = create('Limite de 300 caracteres.');
    type(field, 'a');
    type(field, 'abcde');
    expect(host.querySelectorAll(`.${CHAR_COUNTER_CLASS}`).length).toBe(1);
    expect(counterOf(field).textContent).toBe('5 / 300');
  });

  it('funciona em área de texto, com o limite do Resumo', () => {
    const field = create('Limite de 2000 caracteres.', '<textarea></textarea>');
    type(field, 'x'.repeat(1500));
    expect(counterOf(field).textContent).toBe('1500 / 2000');
  });

  it('destaca o contador acima do limite e volta ao normal abaixo dele', () => {
    const field = create('Limite de 10 caracteres.');
    type(field, 'a'.repeat(10));
    expect(counterOf(field).classList).not.toContain('text-danger');
    expect(counterOf(field).classList).toContain('text-muted');
    type(field, 'a'.repeat(11));
    expect(counterOf(field).classList).toContain('text-danger');
    expect(counterOf(field).classList).toContain('fw-bold');
    expect(counterOf(field).textContent).toBe('11 / 10');
    type(field, 'a'.repeat(4));
    expect(counterOf(field).classList).not.toContain('text-danger');
  });

  it('não mostra contador em campo sem limite ou fora do formulário', () => {
    type(create(null), 'abc');
    expect(host.querySelector(`.${CHAR_COUNTER_CLASS}`)).toBeNull();
    type(create('Limite de 300 caracteres.', '<input type="text">', false), 'abc');
    expect(host.querySelector(`.${CHAR_COUNTER_CLASS}`)).toBeNull();
  });

  it('mostra contador também em campo com sugestão (combobox)', () => {
    const field = create('Limite de 300 caracteres.', '<input type="text" role="combobox" aria-autocomplete="list">');
    type(field, 'abc');
    expect(counterOf(field).textContent).toBe('3 / 300');
  });

  it('nas palavras-chave coloca o contador depois da caixa de chips, com o limite por termo', () => {
    const field = create('Limite de 300 caracteres por termo.', '<ds-chips><input type="text" role="textbox"></ds-chips>');
    type(field, 'abcd');
    const chips = host.querySelector('ds-chips') as HTMLElement;
    expect(counterOf(chips).textContent).toBe('4 / 300');
    type(field, 'abcde');
    expect(host.querySelectorAll(`.${CHAR_COUNTER_CLASS}`).length).toBe(1);
  });

  it('refaz o contador, ainda em vermelho, quando o Angular o remove ao sair do campo', fakeAsync(() => {
    const field = create('Limite de 10 caracteres.');
    type(field, 'a'.repeat(11));
    // O Angular troca o contêiner do campo ao validar, e o contador vai embora.
    counterOf(field).remove();
    expect(host.querySelector(`.${CHAR_COUNTER_CLASS}`)).toBeNull();
    field.dispatchEvent(new Event('blur'));
    tick(CHAR_COUNTER_REDRAW_MS);
    expect(counterOf(field).textContent).toBe('11 / 10');
    expect(counterOf(field).classList).toContain('text-danger');
  }));

  it('acha o campo recriado pelo id ao refazer o contador', fakeAsync(() => {
    const field = create('Limite de 10 caracteres.', '<input type="text" id="campo-teste">');
    field.value = 'abc';
    const antigo = field;
    // O campo muda ("change") e o Angular o troca por um novo com o mesmo id antes do focusout.
    antigo.dispatchEvent(new Event('change', { bubbles: true }));
    const novo = antigo.cloneNode(true) as HTMLInputElement;
    novo.value = 'abc';
    antigo.replaceWith(novo);
    tick(CHAR_COUNTER_REDRAW_MS);
    expect(counterOf(novo)?.textContent).toBe('3 / 10');
  }));

  it('mantém o contador quando a dica some porque o campo ficou inválido', fakeAsync(() => {
    const field = create('Limite de 10 caracteres.', '<input type="text" id="campo-invalido">');
    type(field, 'a'.repeat(11));
    // Campo inválido: o DSpace troca a dica pela mensagem de erro e o Angular remove o contador.
    host.querySelector('.ds-hint').remove();
    counterOf(field).remove();
    field.dispatchEvent(new Event('blur'));
    tick(CHAR_COUNTER_REDRAW_MS);
    expect(counterOf(field).textContent).toBe('11 / 10');
    expect(counterOf(field).classList).toContain('text-danger');
  }));

  it('para de agir depois de desligado', () => {
    const field = create('Limite de 300 caracteres.');
    detach();
    type(field, 'abc');
    expect(host.querySelector(`.${CHAR_COUNTER_CLASS}`)).toBeNull();
  });
});
