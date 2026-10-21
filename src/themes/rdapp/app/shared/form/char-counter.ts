import { isPlainTextControl } from './typing-change';

/**
 * A dica de cada campo do formulário de submissão traz o limite ("Limite de 300 caracteres."), e o mesmo limite é
 * imposto por <regex> no submission-forms.xml (decisão 007). O contador lê o limite da dica, então quem muda um muda o
 * outro no mesmo arquivo.
 */
export const CHAR_LIMIT_PATTERN = /Limite de (\d[\d.]*) caracteres/i;

export const CHAR_COUNTER_CLASS = 'rdapp-char-counter';

/**
 * Limite de caracteres de um campo, lido da dica dentro do mesmo controle do formulário. Nulo quando não há dica ou
 * ela não fala de limite.
 */
export function readCharLimit(control: HTMLElement): number | null {
  const hint = control.closest('ds-dynamic-form-control-container')?.querySelector('.ds-hint');
  const match = hint?.textContent?.match(CHAR_LIMIT_PATTERN);
  return match ? Number(match[1].replace(/\./g, '')) : null;
}

/**
 * Pausa antes de refazer o contador depois que o campo perde o foco. Ao sair do campo o Angular troca o próprio input
 * (a classe passa a "is-invalid", por exemplo) durante o evento "change", e leva o contador junto. Como o input antigo sai
 * do documento antes de o "focusout" acontecer, o redesenho é disparado por "blur" e "change", que ainda o alcançam.
 */
export const CHAR_COUNTER_REDRAW_MS = 100;

const REDRAW_EVENTS = ['blur', 'change', 'focusout'];

/**
 * Mostra "N / limite" logo abaixo dos campos de texto que têm limite, enquanto a pessoa digita ou assim que o campo
 * ganha o foco, e o mantém depois que ela sai do campo. Acima do limite o contador fica em vermelho e em negrito.
 * Devolve a função que o desliga.
 */
export function attachCharCounter(doc: Document): () => void {
  // Com o campo inválido o DSpace troca a dica pela mensagem de erro, e a frase do limite some. O limite lido enquanto o
  // campo estava válido fica guardado por id (ou name), para o contador continuar depois.
  const limits = new Map<string, number>();

  const render = (target: HTMLInputElement | HTMLTextAreaElement) => {
    const key = target.id || target.name;
    let limit = readCharLimit(target);
    if (limit !== null && key) {
      limits.set(key, limit);
    } else if (limit === null && key) {
      limit = limits.get(key) ?? null;
    }
    if (limit === null) {
      return;
    }
    let counter = target.nextElementSibling as HTMLElement | null;
    if (!counter?.classList.contains(CHAR_COUNTER_CLASS)) {
      counter = doc.createElement('small');
      counter.className = `${CHAR_COUNTER_CLASS} form-text text-muted d-block text-end`;
      counter.setAttribute('aria-live', 'off');
      target.insertAdjacentElement('afterend', counter);
    }
    const length = target.value.length;
    const exceeded = length > limit;
    counter.textContent = `${length} / ${limit}`;
    counter.classList.toggle('text-danger', exceeded);
    counter.classList.toggle('fw-bold', exceeded);
    counter.classList.toggle('text-muted', !exceeded);
  };

  const update = (event: Event) => {
    if (isPlainTextControl(event.target)) {
      render(event.target);
    }
  };

  const redrawAfterBlur = (event: Event) => {
    const target = event.target;
    if (!isPlainTextControl(target)) {
      return;
    }
    setTimeout(() => {
      // O campo pode ter sido recriado pelo Angular: procura o atual pelo id.
      const current = target.isConnected ? target : (target.id ? doc.getElementById(target.id) : null);
      if (isPlainTextControl(current)) {
        render(current);
      }
    }, CHAR_COUNTER_REDRAW_MS);
  };

  doc.addEventListener('input', update, true);
  doc.addEventListener('focusin', update, true);
  REDRAW_EVENTS.forEach((name) => doc.addEventListener(name, redrawAfterBlur, true));
  return () => {
    doc.removeEventListener('input', update, true);
    doc.removeEventListener('focusin', update, true);
    REDRAW_EVENTS.forEach((name) => doc.removeEventListener(name, redrawAfterBlur, true));
  };
}
