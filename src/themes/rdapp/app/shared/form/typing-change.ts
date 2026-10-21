/**
 * Tempo de pausa na digitação antes de avisar o formulário de que o valor mudou.
 */
export const TYPING_CHANGE_DEBOUNCE_MS = 500;

/**
 * O formulário de submissão do DSpace só enfileira a alteração de um campo quando o navegador dispara o evento
 * "change", que nos campos de texto só ocorre ao sair do campo. Quem digita e navega antes disso perde o texto, e o
 * aviso de alterações não salvas e o autosave não enxergam nada.
 *
 * A função abaixo registra um ouvinte de "input" que, depois de uma pausa na digitação, dispara o "change" que o formulário
 * já entende. Vale só para campos de texto simples e áreas de texto dentro das seções do formulário de submissão.
 * Campos de busca com sugestão (typeahead) ficam de fora, porque um "change" com texto ainda não selecionado gravaria um
 * valor livre.
 */
/**
 * Liga o ouvinte de "input" em um documento e devolve a função que o desliga. É chamada uma vez pelo RootComponent do
 * tema, no navegador.
 */
export function attachTypingChange(doc: Document, debounceMs = TYPING_CHANGE_DEBOUNCE_MS): () => void {
  const timers = new WeakMap<Element, ReturnType<typeof setTimeout>>();

  const onInput = (event: Event) => {
    const target = event.target;
    if (!isPlainTextControl(target)) {
      return;
    }
    clearTimeout(timers.get(target));
    timers.set(target, setTimeout(() => {
      timers.delete(target);
      target.dispatchEvent(new Event('change', { bubbles: true }));
    }, debounceMs));
  };

  doc.addEventListener('input', onInput, true);
  return () => doc.removeEventListener('input', onInput, true);
}

/**
 * Campo de texto ou área de texto de uma seção do formulário de submissão, sem comportamento de busca com sugestão.
 */
export function isPlainTextControl(target: EventTarget | null): target is HTMLInputElement | HTMLTextAreaElement {
  if (!(target instanceof HTMLInputElement) && !(target instanceof HTMLTextAreaElement)) {
    return false;
  }
  if (target instanceof HTMLInputElement && target.type !== 'text') {
    return false;
  }
  if (target.readOnly || target.disabled) {
    return false;
  }
  if (target.getAttribute('role') === 'combobox' || target.hasAttribute('aria-autocomplete')) {
    return false;
  }
  return target.closest('ds-submission-section-form') !== null;
}
