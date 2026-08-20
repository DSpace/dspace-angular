import {
  PIPELINE_STATUS_DEFAULTS,
  pipelineStatusEndpoint,
  resolvePipelineStatusConfig,
} from './pipeline-status.config';

/** Config da aplicação hospedeira, no formato que o `AppConfig` entrega. */
function appConfig(section: unknown): unknown {
  return { rest: { host: 'exemplo' }, pipelineStatus: section };
}

describe('pipeline-status config', () => {

  describe('cascata de precedência', () => {
    it('usa os defaults quando não há config nem override', () => {
      expect(resolvePipelineStatusConfig(null)).toEqual(PIPELINE_STATUS_DEFAULTS);
    });

    it('lê a seção do AppConfig', () => {
      const config = resolvePipelineStatusConfig(appConfig({
        baseUrl: 'https://api.exemplo.br',
        statusPath: '/api/v2/status',
        timeoutMs: 5000,
        probe: true,
        artifacts: false,
      }));

      expect(config).toEqual({
        baseUrl: 'https://api.exemplo.br',
        statusPath: '/api/v2/status',
        timeoutMs: 5000,
        probe: true,
        artifacts: false,
      });
    });

    it('override vence o AppConfig', () => {
      const config = resolvePipelineStatusConfig(
        appConfig({ baseUrl: 'https://config.exemplo.br' }),
        { baseUrl: 'https://input.exemplo.br' },
      );

      expect(config.baseUrl).toBe('https://input.exemplo.br');
    });

    it('override nulo não apaga o que veio do AppConfig', () => {
      const config = resolvePipelineStatusConfig(
        appConfig({ baseUrl: 'https://config.exemplo.br', probe: true }),
        { baseUrl: null, probe: undefined },
      );

      expect(config.baseUrl).toBe('https://config.exemplo.br');
      expect(config.probe).toBeTrue();
    });

    it('seção pela metade preserva os demais defaults', () => {
      const config = resolvePipelineStatusConfig(appConfig({ baseUrl: 'https://api.exemplo.br' }));

      expect(config.statusPath).toBe(PIPELINE_STATUS_DEFAULTS.statusPath);
      expect(config.timeoutMs).toBe(PIPELINE_STATUS_DEFAULTS.timeoutMs);
      expect(config.artifacts).toBe(PIPELINE_STATUS_DEFAULTS.artifacts);
    });

    it('sobrevive a AppConfig ausente, vazio ou sem a seção', () => {
      [null, undefined, {}, { pipelineStatus: null }, { pipelineStatus: 'nada disso' }]
        .forEach((candidate: unknown) => {
          expect(resolvePipelineStatusConfig(candidate))
            .withContext(JSON.stringify(candidate))
            .toEqual(PIPELINE_STATUS_DEFAULTS);
        });
    });

    it('descarta valores de tipo errado ou sem sentido', () => {
      const config = resolvePipelineStatusConfig(appConfig({
        baseUrl: '   ',
        statusPath: 42,
        timeoutMs: -1,
        probe: 'sim',
      }));

      expect(config).toEqual(PIPELINE_STATUS_DEFAULTS);
    });

    it('false do AppConfig é respeitado (não confundir com ausente)', () => {
      const config = resolvePipelineStatusConfig(appConfig({ artifacts: false }));

      expect(config.artifacts).toBeFalse();
    });
  });

  describe('montagem do endpoint', () => {
    it('junta base e caminho sem barra dupla nem barra faltando', () => {
      ([
        ['/', '/api/status', '/api/status'],
        ['https://h', '/api/status', 'https://h/api/status'],
        ['https://h/', 'api/status', 'https://h/api/status'],
        ['https://h///', '/api/status', 'https://h/api/status'],
      ] as [string, string, string][]).forEach(([baseUrl, statusPath, expected]) => {
        expect(pipelineStatusEndpoint({ ...PIPELINE_STATUS_DEFAULTS, baseUrl, statusPath }))
          .withContext(`${baseUrl} + ${statusPath}`)
          .toBe(expected);
      });
    });

    it('preserva prefixo de path na base (onde new URL falharia)', () => {
      const endpoint = pipelineStatusEndpoint({
        ...PIPELINE_STATUS_DEFAULTS,
        baseUrl: 'https://h/pipe',
        statusPath: '/api/status',
      });

      expect(endpoint).toBe('https://h/pipe/api/status');
    });

    it('o endpoint default é relativo à própria origem', () => {
      expect(pipelineStatusEndpoint(PIPELINE_STATUS_DEFAULTS)).toBe('/api/status');
    });
  });
});
