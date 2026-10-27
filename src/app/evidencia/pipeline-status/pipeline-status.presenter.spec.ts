import { PIPELINE_STATUS_MOCK } from './pipeline-status.mock';
import { PipelineStatusResponse } from './pipeline-status.model';
import {
  buildAlerts,
  buildCapabilities,
  buildComponents,
  buildConfig,
  buildDetail,
  buildFlow,
  buildHeader,
} from './pipeline-status.presenter';
import {
  ageLabel,
  ComponentView,
  humanizeKey,
  labelFor,
  statusMeta,
} from './pipeline-status.view';

/** Clona a fixture para cada caso poder alterá-la sem contaminar os outros. */
function response(overrides: Partial<PipelineStatusResponse> = {}): PipelineStatusResponse {
  return { ...JSON.parse(JSON.stringify(PIPELINE_STATUS_MOCK)) as PipelineStatusResponse, ...overrides };
}

function component(views: ComponentView[], key: string): ComponentView {
  return views.find((view: ComponentView) => view.key === key);
}

describe('pipeline-status presenter', () => {

  describe('estados', () => {
    it('dá rótulo, ícone e classe para cada estado', () => {
      expect(statusMeta('ok').labelKey).toBe('health-page.pipeline.status.ok');
      expect(statusMeta('degraded').icon).toBe('fa-exclamation-triangle');
      expect(statusMeta('down').modifier).toBe('is-down');
      expect(statusMeta('not_configured').icon).toBe('fa-info-circle');
    });

    it('cai em desconhecido para estado que a API não previa', () => {
      expect(statusMeta('inventado').kind).toBe('unknown');
      expect(statusMeta(undefined).kind).toBe('unknown');
    });
  });

  describe('cabeçalho', () => {
    it('lê o resumo, a idade e o tempo da consulta da resposta', () => {
      const header = buildHeader(response());

      expect(header.status.kind).toBe('ok');
      expect(header.allCriticalOk).toBeTrue();
      expect(header.summary.map((item) => item.count)).toEqual([11, 0, 0, 2]);
      expect(header.generatedAt).toBe('2026-08-18T17:10:06.110855+00:00');
      expect(header.tookMs).toEqual({ kind: 'ms', num: 2178.1 });
    });

    it('avisa quando um componente crítico está degradado', () => {
      const payload = response();
      payload.components.qdrant.status = 'degraded';

      expect(buildHeader(payload).allCriticalOk).toBeFalse();
    });

    it('ignora problema em componente opcional para a mensagem de tranquilidade', () => {
      const payload = response();
      payload.components.flower.status = 'down';

      expect(buildHeader(payload).allCriticalOk).toBeTrue();
    });

    it('sobrevive a uma resposta sem resumo', () => {
      const header = buildHeader({ status: 'ok' });

      expect(header.summary.every((item) => item.count === 0)).toBeTrue();
      expect(header.generatedAt).toBeNull();
    });
  });

  describe('idade da verificação', () => {
    it('usa texto amigável em vez de segundos', () => {
      expect(ageLabel(0).key).toBe('health-page.pipeline.age.just-now');
      expect(ageLabel(120)).toEqual({ key: 'health-page.pipeline.age.minutes', params: { count: 2 } });
      expect(ageLabel(60).key).toBe('health-page.pipeline.age.minutes-one');
      expect(ageLabel(7200).key).toBe('health-page.pipeline.age.hours');
      expect(ageLabel(200000).key).toBe('health-page.pipeline.age.days');
      expect(ageLabel(undefined).key).toBe('health-page.pipeline.age.unknown');
    });
  });

  describe('capacidades', () => {
    it('mapeia as cinco capacidades com nome, descrição e ícone', () => {
      const capabilities = buildCapabilities(response());

      expect(capabilities.map((item) => item.key))
        .toEqual(['busca', 'ingestao', 'extracao', 'indexacao', 'enriquecimento_llm']);
      expect(capabilities[0].available).toBeTrue();
      expect(capabilities[0].description).toContain('/api/search/semantic');
      expect(capabilities[0].icon).toBe('fa-search');
      expect(capabilities[0].nameKey).toBe('health-page.pipeline.capability.busca');
    });

    it('expõe as dependências que bloqueiam uma capacidade', () => {
      const payload = response();
      payload.capabilities.busca = { available: false, blocked_by: ['qdrant', 'embedder'] };

      expect(buildCapabilities(payload)[0].blockedBy).toEqual(['qdrant', 'embedder']);
    });
  });

  describe('fluxo do pipeline', () => {
    it('monta as seis etapas na ordem do pipeline', () => {
      expect(buildFlow(response()).map((step) => step.key))
        .toEqual(['dspace', 'mineru', 'minio', 'embedder', 'qdrant', 'search']);
    });

    it('tira o estado de cada etapa do componente correspondente', () => {
      const payload = response();
      payload.components.mineru.status = 'degraded';
      const flow = buildFlow(payload);

      expect(flow[1].status.kind).toBe('degraded');
      expect(flow[4].status.kind).toBe('ok');
    });

    it('usa a capacidade de busca como estado da última etapa', () => {
      const payload = response();
      payload.capabilities.busca.available = false;

      expect(buildFlow(payload)[5].status.kind).toBe('down');
    });

    it('traz métricas reais em cada etapa', () => {
      const flow = buildFlow(response());

      expect(flow[1].metrics[0].value).toEqual({ kind: 'int', num: 83 });
      expect(flow[2].metrics[0].value).toEqual({ kind: 'int', num: 149 });
      expect(flow[3].metrics[0]).toEqual({
        labelKey: 'health-page.pipeline.field.model',
        value: { kind: 'text', text: 'BAAI/bge-m3' },
      });
      expect(flow[4].metrics[0].value).toEqual({ kind: 'int', num: 42427 });
    });
  });

  describe('componentes', () => {
    it('constrói um cartão para cada componente da API', () => {
      expect(buildComponents(response()).length).toBe(13);
    });

    it('coloca problemas antes do resto', () => {
      const payload = response();
      payload.components.disk.status = 'down';
      payload.components.mineru.status = 'degraded';

      const order = buildComponents(payload).map((view) => view.key);

      expect(order[0]).toBe('disk');
      expect(order[1]).toBe('mineru');
      expect(order[order.length - 1]).toBe('llm_visual');
    });

    it('distingue crítico de opcional', () => {
      const views = buildComponents(response());

      expect(component(views, 'qdrant').critical).toBeTrue();
      expect(component(views, 'flower').critical).toBeFalse();
    });

    it('marca opcional não configurado sem tratar como erro', () => {
      const flower = component(buildComponents(response()), 'flower');

      expect(flower.status.kind).toBe('not_configured');
      expect(flower.optionalNotConfigured).toBeTrue();
    });

    it('limita o cartão a três métricas', () => {
      buildComponents(response()).forEach((view: ComponentView) => {
        expect(view.metrics.length).withContext(view.key).toBeLessThanOrEqual(3);
      });
    });

    it('usa as métricas específicas de cada componente', () => {
      const views = buildComponents(response());

      expect(component(views, 'qdrant').metrics[0].value).toEqual({ kind: 'int', num: 42427 });
      expect(component(views, 'minio').metrics[2].value).toEqual({ kind: 'bytes', num: 2027562624 });
      expect(component(views, 'celery').metrics[0].value).toEqual({ kind: 'int', num: 2 });
      expect(component(views, 'jobs').metrics[2].value).toEqual({ kind: 'int', num: 1 });
      expect(component(views, 'llm_enrich').metrics[1].value).toEqual({ kind: 'text', text: 'deepseek-v4-flash' });
    });

    it('descreve os dois endpoints do embedder em uma frase', () => {
      const embedder = component(buildComponents(response()), 'embedder');

      expect(embedder.metrics[2].value).toEqual({ kind: 'key', key: 'health-page.pipeline.value.dense-and-sparse' });
    });

    it('gera barra de memória da GPU a partir de usado/total', () => {
      const gpu = component(buildComponents(response()), 'gpu');

      expect(gpu.bars.length).toBe(1);
      expect(gpu.bars[0].percent).toBe(84);
      expect(gpu.bars[0].captionParams).toEqual({ used: '40.2 GB', total: '48.0 GB' });
      expect(gpu.bars[0].warning).toBeFalse();
    });

    it('gera barra de disco e alerta quando o espaço livre passa do limite', () => {
      const payload = response();
      const disk = component(buildComponents(payload), 'disk');

      expect(disk.bars[0].percent).toBe(76);
      expect(disk.bars[0].warning).toBeFalse();

      payload.components.disk.detail.free_percent_min = 5;

      expect(component(buildComponents(payload), 'disk').bars[0].warning).toBeTrue();
    });

    it('preserva a orientação (hint) que a API mandou', () => {
      expect(component(buildComponents(response()), 'jobs').hint)
        .toContain('/api/files/failures');
    });

    it('não repete no detalhe o que já é métrica', () => {
      const qdrant = component(buildComponents(response()), 'qdrant');
      const labels = qdrant.detail.rows.map((row) => row.labelKey);

      expect(labels).not.toContain('health-page.pipeline.field.chunks');
      expect(labels).toContain('health-page.pipeline.field.collection');
    });

    it('sobrevive a componente sem detail', () => {
      const payload = response();
      payload.components.flower.detail = undefined;
      const flower = component(buildComponents(payload), 'flower');

      expect(flower.detail.rows).toEqual([]);
      expect(flower.detail.groups).toEqual([]);
    });
  });

  describe('detalhes', () => {
    it('vira objetos em grupos, sem [object Object]', () => {
      const detail = buildDetail({
        connected_clients: 89,
        dbs: { broker: { ok: true, keys: 6 } },
      });

      expect(detail.rows[0].value).toEqual({ kind: 'int', num: 89 });
      expect(detail.groups.length).toBe(1);
      // Campo conhecido mantém o rótulo traduzido; o caminho vira prefixo.
      expect(detail.groups[0].rows).toEqual([
        { prefix: 'Broker', label: 'Ok', value: { kind: 'key', key: 'health-page.pipeline.value.yes' } },
        { prefix: 'Broker', labelKey: 'health-page.pipeline.field.keys', value: { kind: 'int', num: 6 } },
      ]);
    });

    it('vira lista de objetos em um grupo por item', () => {
      const detail = buildDetail({ devices: [{ index: 0, name: 'RTX A6000' }] });

      expect(detail.groups[0].label).toBe('Devices 0');
      expect(detail.groups[0].rows[1].value).toEqual({ kind: 'text', text: 'RTX A6000' });
    });

    it('mostra booleano como palavra e lista vazia como "nenhum"', () => {
      const detail = buildDetail({ writable: true, queues_missing: [] });

      expect(detail.rows[0].value).toEqual({ kind: 'key', key: 'health-page.pipeline.value.yes' });
      expect(detail.rows[1].value).toEqual({ kind: 'key', key: 'health-page.pipeline.value.empty-list' });
    });

    it('escolhe a unidade pelo sufixo do campo', () => {
      const detail = buildDetail({
        size_bytes: 1024,
        used_memory_mb: 2.6,
        free_percent: 24.1,
        scan_ms: 1758.8,
        ttl_seconds: 604800,
        temperature_celsius: 34,
      });
      const kinds = detail.rows.map((row) => row.value.kind);

      expect(kinds).toEqual(['bytes', 'megabytes', 'percent', 'ms', 'seconds', 'celsius']);
    });

    it('junta array de escalares em um texto legível', () => {
      const detail = buildDetail({ queues_expected: ['download', 'gpu'] });

      expect(detail.rows[0].value).toEqual({ kind: 'text', text: 'download, gpu' });
    });
  });

  describe('rótulos', () => {
    it('traduz campo conhecido e humaniza campo novo', () => {
      expect(labelFor('chunks')).toEqual({ labelKey: 'health-page.pipeline.field.chunks' });
      expect(labelFor('campo_novo_da_api')).toEqual({ label: 'Campo novo da api' });
      expect(humanizeKey('used_memory_mb')).toBe('Used memory mb');
    });
  });

  describe('alertas', () => {
    it('não inventa alerta quando tudo está bem', () => {
      const payload = response();
      payload.components.jobs.detail.failed = 0;
      payload.components.flower.status = 'ok';
      payload.components.llm_visual.status = 'ok';

      expect(buildAlerts(payload)).toEqual([]);
    });

    it('avisa de job com falha no singular', () => {
      const alerts = buildAlerts(response());
      const jobs = alerts.find((alert) => alert.kind === 'jobs');

      expect(jobs.textKey).toBe('health-page.pipeline.alert.jobs-failed-one');
      expect(jobs.textParams).toEqual({ count: 1 });
      expect(jobs.severity).toBe('warning');
      expect(jobs.hint).toContain('/api/files/failures');
    });

    it('usa o plural quando há mais de um job com falha', () => {
      const payload = response();
      payload.components.jobs.detail.failed = 3;
      const jobs = buildAlerts(payload).find((alert) => alert.kind === 'jobs');

      expect(jobs.textKey).toBe('health-page.pipeline.alert.jobs-failed');
      expect(jobs.textParams).toEqual({ count: 3 });
    });

    it('trata opcional não configurado como informação', () => {
      const optional = buildAlerts(response()).filter((alert) => alert.kind === 'optional');

      expect(optional.length).toBe(2);
      expect(optional.every((alert) => alert.severity === 'info')).toBeTrue();
      expect(optional[0].textKey).toBe('health-page.pipeline.alert.optional-not-configured');
    });

    it('trata crítico não configurado como problema', () => {
      const payload = response();
      payload.components.qdrant.status = 'not_configured';
      const alert = buildAlerts(payload).find((item) => item.kind === 'optional');

      expect(alert.severity).toBe('danger');
      expect(alert.textKey).toBe('health-page.pipeline.alert.critical-not-configured');
    });

    it('repassa blocking e warnings da API como texto', () => {
      const payload = response({ blocking: ['qdrant fora do ar'], warnings: ['disco apertado'] });
      const alerts = buildAlerts(payload);

      expect(alerts[0]).toEqual(jasmine.objectContaining({ kind: 'blocking', severity: 'danger', text: 'qdrant fora do ar' }));
      expect(alerts[1]).toEqual(jasmine.objectContaining({ kind: 'warning', severity: 'warning', text: 'disco apertado' }));
    });

    it('avisa de componente indisponível e degradado', () => {
      const payload = response();
      payload.components.qdrant.status = 'down';
      payload.components.mineru.status = 'degraded';
      const alerts = buildAlerts(payload);

      expect(alerts.some((alert) => alert.kind === 'down' && alert.severity === 'danger')).toBeTrue();
      expect(alerts.some((alert) => alert.kind === 'degraded' && alert.severity === 'warning')).toBeTrue();
    });

    it('avisa de fila sem worker', () => {
      const payload = response();
      payload.components.celery.detail.queues_missing = ['gpu', 'llm'];
      const alert = buildAlerts(payload).find((item) => item.kind === 'queues');

      expect(alert.textParams).toEqual({ queues: 'gpu, llm' });
    });
  });

  describe('configuração técnica', () => {
    it('agrupa serviço, embedding, extração, chunking e busca', () => {
      const groups = buildConfig(response());

      expect(groups.map((group) => group.labelKey)).toEqual([
        'health-page.pipeline.config.service',
        'health-page.pipeline.config.embedding',
        'health-page.pipeline.config.extraction',
        'health-page.pipeline.config.chunking',
        'health-page.pipeline.config.search',
      ]);
    });

    it('preserva valores técnicos e formata o tempo de atividade', () => {
      const groups = buildConfig(response());
      const service = groups[0].rows;
      const embedding = groups[1].rows;

      expect(service[0].value).toEqual({ kind: 'text', text: 'evidencia_pipe' });
      expect(service[2].value).toEqual({ kind: 'seconds', num: 1798.6 });
      expect(embedding[0].value).toEqual({ kind: 'text', text: 'BAAI/bge-m3' });
      expect(embedding[1].value).toEqual({ kind: 'int', num: 1024 });
    });

    it('omite grupo ausente na resposta', () => {
      const payload = response();
      payload.config.chunking = undefined;

      expect(buildConfig(payload).map((group) => group.labelKey))
        .not.toContain('health-page.pipeline.config.chunking');
    });
  });
});
