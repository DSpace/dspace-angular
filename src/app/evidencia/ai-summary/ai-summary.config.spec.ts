import {
  AI_SUMMARY_DEFAULTS,
  aiSummaryEndpoint,
  resolveAiSummaryConfig,
} from './ai-summary.config';
import { EVIDENCIA_API_BASE } from './host';

describe('ai-summary.config', () => {

  describe('resolveAiSummaryConfig', () => {

    it('nasce ligada e apontando para a API RDAPP', () => {
      const config = resolveAiSummaryConfig(null);

      expect(config.enabled).toBeTrue();
      expect(config.baseUrl).toBe(EVIDENCIA_API_BASE);
      expect(config.summarizePath).toBe('/api/search/summarize');
      expect(config.timeoutMs).toBe(45000);
    });

    it('deixa a instalação desligar a aba', () => {
      expect(resolveAiSummaryConfig({ aiSummary: { enabled: false } }).enabled).toBeFalse();
    });

    it('lê a seção `aiSummary` do app config', () => {
      // 15 e não 25: a API valida `limit` em 1..20, e a resolução agora prende o
      // valor nessa faixa em vez de deixar o 422 acontecer.
      const config = resolveAiSummaryConfig({ aiSummary: { enabled: true, baseUrl: 'https://api.exemplo.edu', limit: 15 } });

      expect(config.enabled).toBeTrue();
      expect(config.baseUrl).toBe('https://api.exemplo.edu');
      expect(config.limit).toBe(15);
    });

    it('lê o `k` por documento da seção `aiSummary`', () => {
      const config = resolveAiSummaryConfig({ aiSummary: { limitPerDocument: 3 } });

      expect(config.limitPerDocument).toBe(3);
      // O total da busca inteira é outro número e não se mexe junto.
      expect(config.limit).toBe(AI_SUMMARY_DEFAULTS.limit);
    });

    it('prende `limit` na faixa que a API aceita (1..20)', () => {
      expect(resolveAiSummaryConfig({ aiSummary: { limit: 50 } }).limit).toBe(20);
      expect(resolveAiSummaryConfig({ aiSummary: { limitPerDocument: 99 } }).limitPerDocument).toBe(20);
    });

    it('trata `baseUrl` vazio como "não configurado"', () => {
      const config = resolveAiSummaryConfig({ aiSummary: { enabled: true, baseUrl: '' } });

      expect(config.baseUrl).toBe(EVIDENCIA_API_BASE);
    });

    it('não deixa uma seção pela metade apagar os demais campos', () => {
      const config = resolveAiSummaryConfig({ aiSummary: { enabled: true } });

      expect(config.summarizePath).toBe(AI_SUMMARY_DEFAULTS.summarizePath);
      expect(config.timeoutMs).toBe(AI_SUMMARY_DEFAULTS.timeoutMs);
    });

    it('deixa o override pontual vencer o app config', () => {
      const config = resolveAiSummaryConfig({ aiSummary: { timeoutMs: 5000 } }, { timeoutMs: 1000 });

      expect(config.timeoutMs).toBe(1000);
    });

    it('ignora número inválido e volta ao default', () => {
      const config = resolveAiSummaryConfig({ aiSummary: { timeoutMs: 0, limit: -3 } });

      expect(config.timeoutMs).toBe(AI_SUMMARY_DEFAULTS.timeoutMs);
      expect(config.limit).toBe(AI_SUMMARY_DEFAULTS.limit);
    });

    it('sobrevive a um app config que não é objeto', () => {
      expect(resolveAiSummaryConfig('nada')).toEqual({ ...AI_SUMMARY_DEFAULTS });
    });
  });

  describe('aiSummaryEndpoint', () => {

    it('junta base e caminho sem barra dupla', () => {
      const url = aiSummaryEndpoint({ ...AI_SUMMARY_DEFAULTS, baseUrl: 'https://api.exemplo.edu/' });

      expect(url).toBe('https://api.exemplo.edu/api/search/summarize');
    });

    it('preserva prefixo de path da base', () => {
      const url = aiSummaryEndpoint({ ...AI_SUMMARY_DEFAULTS, baseUrl: 'https://h/rdapp' });

      expect(url).toBe('https://h/rdapp/api/search/summarize');
    });

    it('aceita caminho sem barra inicial', () => {
      const url = aiSummaryEndpoint({ ...AI_SUMMARY_DEFAULTS, baseUrl: 'https://h', summarizePath: 'api/x' });

      expect(url).toBe('https://h/api/x');
    });
  });
});
