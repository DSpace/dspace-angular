import {
  ComponentFixture,
  TestBed,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { TranslateLoaderMock } from '@dspace/core/testing/translate-loader.mock';
import {
  TranslateLoader,
  TranslateModule,
} from '@ngx-translate/core';
import {
  NEVER,
  of,
  throwError,
} from 'rxjs';

import { AiSummaryComponent } from './ai-summary.component';
import { AiSummaryResponse } from './ai-summary.model';
import {
  AiSummaryError,
  AiSummaryService,
} from './ai-summary.service';
import { AiSummaryPdfService } from './ai-summary-pdf.service';

const RESPONSE: AiSummaryResponse = {
  summary: '**Educação básica**\n- Principais evidências [1] e mais.',
  sections: [],
  citations: [
    { n: 1, section: '5.1', page: 138, snippet: 'trecho', title: 'Relatório 2022', itemUuid: 'uuid-1', itemHandle: null },
    { n: 2, section: '5.2', page: 140, snippet: 'outro', title: 'Relatório 2022', itemUuid: 'uuid-1', itemHandle: null },
  ],
  filtersUsed: [{ key: 'year', value: '2024' }],
  evidenceCount: 10,
};

describe('AiSummaryComponent', () => {
  let component: AiSummaryComponent;
  let fixture: ComponentFixture<AiSummaryComponent>;
  let service: jasmine.SpyObj<AiSummaryService>;
  let pdf: jasmine.SpyObj<AiSummaryPdfService>;

  function setup(query = 'educacao', active = false): void {
    // O modo escolhido persiste no sessionStorage; cada teste parte do geral.
    sessionStorage.clear();
    service = jasmine.createSpyObj('AiSummaryService', ['summarize', 'forget'], { enabled: true, maxDocuments: 20 });
    service.summarize.and.returnValue(of(RESPONSE));
    pdf = jasmine.createSpyObj('AiSummaryPdfService', ['open', 'canOpen']);
    pdf.canOpen.and.returnValue(true);

    TestBed.configureTestingModule({
      imports: [
        AiSummaryComponent,
        TranslateModule.forRoot({
          loader: { provide: TranslateLoader, useClass: TranslateLoaderMock },
        }),
      ],
      providers: [
        { provide: AiSummaryService, useValue: service },
        { provide: AiSummaryPdfService, useValue: pdf },
      ],
    });

    fixture = TestBed.createComponent(AiSummaryComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('query', query);
    fixture.componentRef.setInput('active', active);
    fixture.detectChanges();
  }

  afterEach(() => {
    fixture?.destroy();
  });

  it('não chama a API com a aba fechada', () => {
    setup('educacao', false);

    expect(service.summarize).not.toHaveBeenCalled();
  });

  it('chama a API quando a aba abre', () => {
    setup('educacao', true);

    expect(service.summarize).toHaveBeenCalledTimes(1);
    expect(component.data()).toEqual(RESPONSE);
  });

  it('não chama a API sem consulta', () => {
    setup('   ', true);

    expect(service.summarize).not.toHaveBeenCalled();
  });

  it('volta ao modo escolhido depois de um F5', () => {
    setup('educacao', true);
    component.setMode('by_section');
    fixture.destroy();

    // `setup` limpa o storage; aqui a página recarrega com ele intacto.
    const reloaded = TestBed.createComponent(AiSummaryComponent);

    expect(reloaded.componentInstance.mode()).toBe('by_section');
    reloaded.destroy();
  });

  it('refaz a síntese ao trocar de modo', () => {
    setup('educacao', true);

    component.setMode('by_section');
    fixture.detectChanges();

    expect(service.summarize).toHaveBeenCalledTimes(2);
    expect(service.summarize.calls.mostRecent().args[0].mode).toBe('by_section');
  });

  it('repassa os documentos marcados para a API', () => {
    setup('educacao', true);

    fixture.componentRef.setInput('documents', [{ uuid: 'uuid-1', handle: '123456789/150' }]);
    fixture.detectChanges();

    expect(service.summarize.calls.mostRecent().args[0].documents)
      .toEqual([{ uuid: 'uuid-1', handle: '123456789/150' }]);
  });

  it('diz na tela quando a síntese está restrita a uma seleção', () => {
    setup('educacao', true);

    expect(fixture.debugElement.query(By.css('[data-test="evidencia.search.ai-summary.scope"]'))).toBeNull();

    fixture.componentRef.setInput('documents', [
      { uuid: 'uuid-1', handle: null },
      { uuid: 'uuid-2', handle: null },
    ]);
    fixture.detectChanges();

    expect(fixture.debugElement.query(By.css('[data-test="evidencia.search.ai-summary.scope"]'))).not.toBeNull();
    expect(component.documentCount()).toBe(2);
    expect(component.scopeKey()).toBe('evidencia.search.ai-summary.scope.selected-many');
  });

  it('não chama a API com seleção acima do teto e explica o porquê', () => {
    setup('educacao', true);
    service.summarize.calls.reset();

    fixture.componentRef.setInput('documents', Array.from(
      { length: component.maxDocuments + 1 },
      (_unused: unknown, i: number) => ({ uuid: `uuid-${i}`, handle: null }),
    ));
    fixture.detectChanges();

    expect(service.summarize).not.toHaveBeenCalled();
    expect(fixture.debugElement.query(By.css('[data-test="evidencia.search.ai-summary.too-many"]'))).not.toBeNull();
    // O aviso substitui a linha de escopo: nada foi sintetizado.
    expect(fixture.debugElement.query(By.css('[data-test="evidencia.search.ai-summary.scope"]'))).toBeNull();
  });

  it('usa a frase no singular com um documento só', () => {
    setup('educacao', true);

    fixture.componentRef.setInput('documents', [{ uuid: 'uuid-1', handle: null }]);
    fixture.detectChanges();

    expect(component.scopeKey()).toBe('evidencia.search.ai-summary.scope.selected-one');
  });

  it('esvazia a síntese anterior quando a consulta muda', () => {
    setup('educacao', true);
    service.summarize.and.returnValue(throwError(() => ({ kind: 'http', status: 503 } as AiSummaryError)));

    fixture.componentRef.setInput('query', 'saude');
    fixture.detectChanges();

    expect(component.data()).toBeNull();
  });

  it('renderiza o Markdown da síntese em blocos, com a citação clicável', () => {
    setup('educacao', true);

    expect(component.blocks().map((block) => block.kind)).toEqual(['paragraph', 'list']);
    // O título em negrito vira `<strong>`, não asteriscos na tela.
    expect(fixture.debugElement.query(By.css('.rdapp-ai__text strong')).nativeElement.textContent)
      .toBe('Educação básica');
    expect(fixture.debugElement.queryAll(By.css('.rdapp-ai__list li')).length).toBe(1);
    expect(fixture.debugElement.queryAll(By.css('.rdapp-ai__cite')).length).toBe(1);
  });

  it('expõe os títulos do Markdown como títulos para o leitor de tela', () => {
    setup('educacao', true);
    service.summarize.and.returnValue(of({ ...RESPONSE, summary: '## Síntese\n\nTexto.\n\n### Marco legal\n\nMais [1].' }));

    fixture.componentRef.setInput('query', 'saude');
    fixture.detectChanges();

    const headings = fixture.debugElement.queryAll(By.css('.rdapp-ai__heading'));
    expect(headings.map((h) => h.attributes.role)).toEqual(['heading', 'heading']);
    // Abaixo do h2 do painel: `##` em 3, `###` em 4.
    expect(headings.map((h) => h.attributes['aria-level'])).toEqual(['3', '4']);
  });

  it('desce um nível nos títulos dentro de uma seção, que já tem h3', () => {
    setup();

    expect(component.headingLevel(4, 1)).toBe(4);
    expect(component.headingLevel(4, 3)).toBe(5);
    expect(component.headingLevel(6, 4)).toBe(6);
  });

  it('põe só o texto gerado no card, com fontes e aviso fora dele', () => {
    setup('educacao', true);

    const output = fixture.debugElement.query(By.css('[data-test="evidencia.search.ai-summary.output"]'));
    expect(output.query(By.css('.rdapp-ai__text'))).not.toBeNull();
    expect(output.query(By.css('.rdapp-ai__sources'))).toBeNull();
    expect(output.query(By.css('.rdapp-ai__disclaimer'))).toBeNull();
  });

  it('copia a síntese como texto puro e confirma no botão', async () => {
    setup('educacao', true);
    const writeText = spyOn(navigator.clipboard, 'writeText').and.returnValue(Promise.resolve());

    fixture.debugElement.query(By.css('[data-test="evidencia.search.ai-summary.copy"]')).nativeElement.click();
    // O clique dispara a cópia; o `then` dela roda numa microtarefa depois.
    await writeText.calls.mostRecent().returnValue;
    await Promise.resolve();
    fixture.detectChanges();

    expect(writeText).toHaveBeenCalledWith('Educação básica\n\n- Principais evidências[1] e mais.');
    expect(component.copyState()).toBe('copied');
    expect(fixture.debugElement.query(By.css('.rdapp-ai__copy--done'))).not.toBeNull();
  });

  it('avisa no botão quando a cópia falha', async () => {
    setup('educacao', true);
    spyOn(navigator.clipboard, 'writeText').and.returnValue(Promise.reject(new Error('negado')));

    await component.copy();

    expect(component.copyState()).toBe('failed');
  });

  it('mostra a mensagem do erro e oferece nova tentativa', () => {
    setup('educacao', false);
    service.summarize.and.returnValue(throwError(() => ({ kind: 'http', status: 503 } as AiSummaryError)));

    fixture.componentRef.setInput('active', true);
    fixture.detectChanges();

    expect(component.errorKey()).toBe('evidencia.search.ai-summary.error.gateway');
    expect(component.canRetry()).toBeTrue();
    expect(component.unavailable()).toBeFalse();
  });

  it('marca a síntese como indisponível quando o endpoint não existe', () => {
    setup('educacao', false);
    service.summarize.and.returnValue(throwError(() => ({ kind: 'http', status: 404 } as AiSummaryError)));

    fixture.componentRef.setInput('active', true);
    fixture.detectChanges();

    expect(component.unavailable()).toBeTrue();
    expect(component.canRetry()).toBeFalse();
  });

  it('descarta o cache ao gerar de novo', () => {
    setup('educacao', true);

    component.retry();

    expect(service.forget).toHaveBeenCalledTimes(1);
    expect(service.summarize).toHaveBeenCalledTimes(2);
  });

  it('leva a citação para a página do PDF', () => {
    setup('educacao', true);

    fixture.debugElement.query(By.css('[data-test="evidencia.search.ai-summary.source-page"]'))
      .nativeElement.click();

    expect(pdf.open).toHaveBeenCalledWith(RESPONSE.citations[0]);
  });

  it('lista cada documento uma vez, com os números que apontam para ele', () => {
    setup('educacao', true);

    const sources = fixture.debugElement.queryAll(By.css('.rdapp-ai__source'));
    expect(sources.length).toBe(1);
    expect(sources[0].query(By.css('.rdapp-ai__source-name')).nativeElement.textContent.trim())
      .toBe('Relatório 2022');
    expect(sources[0].queryAll(By.css('.rdapp-ai__mark')).map((mark) => mark.nativeElement.textContent.trim()))
      .toEqual(['[1]', '[2]']);
  });

  it('cada marcador da fonte abre a sua própria página', () => {
    setup('educacao', true);

    fixture.debugElement.queryAll(By.css('.rdapp-ai__mark'))[1].nativeElement.click();

    expect(pdf.open).toHaveBeenCalledWith(RESPONSE.citations[1]);
  });

  it('anuncia que o conteúdo foi gerado por IA', () => {
    setup('educacao', true);

    expect(fixture.debugElement.query(By.css('[data-test="evidencia.search.ai-summary.badge"]')))
      .not.toBeNull();
  });

  it('mostra o texto que chegou quando o modo por seção volta sem seções', () => {
    setup('educacao', true);

    // A API responde `mode=by_section` com o texto em `summary` e `sections`
    // vazio: desenhar a grade só porque o modo está selecionado punha um painel
    // em branco entre a contagem de evidências e as fontes.
    component.setMode('by_section');
    fixture.detectChanges();

    expect(component.sectioned()).toBeFalse();
    expect(fixture.debugElement.query(By.css('.rdapp-ai__sections'))).toBeNull();
    expect(fixture.debugElement.query(By.css('[data-test="evidencia.search.ai-summary.text"]')))
      .not.toBeNull();
  });

  it('desenha a grade quando a API manda seções', () => {
    setup('educacao', true);
    service.summarize.and.returnValue(of({
      ...RESPONSE,
      summary: '',
      sections: [
        { key: 'results', title: 'Resultados', summary: 'Texto da seção [1].' },
        { key: 'method', title: 'Método', summary: 'Outro texto.' },
      ],
    } as AiSummaryResponse));

    component.setMode('by_section');
    fixture.detectChanges();

    expect(component.sectioned()).toBeTrue();
    expect(fixture.debugElement.queryAll(By.css('.rdapp-ai__section-title'))
      .map((title) => title.nativeElement.textContent.trim())).toEqual(['Resultados', 'Método']);
  });

  it('mantém a síntese na tela enquanto o novo modo carrega', () => {
    setup('educacao', true);
    service.summarize.and.returnValue(NEVER);

    component.setMode('by_section');
    fixture.detectChanges();

    // Esvaziar aqui derrubaria a altura do painel debaixo de quem está lendo.
    expect(component.data()).toEqual(RESPONSE);
    expect(component.firstLoad()).toBeFalse();
    expect(component.refreshing()).toBeTrue();
    expect(fixture.debugElement.query(By.css('[data-test="evidencia.search.ai-summary.refreshing"]')))
      .not.toBeNull();
    expect(fixture.debugElement.query(By.css('[data-test="evidencia.search.ai-summary.text"]')))
      .not.toBeNull();
  });

  it('fecha a frase antes do marcador de citação', () => {
    setup('educacao', true);
    service.summarize.and.returnValue(of({
      ...RESPONSE,
      summary: 'Segundo o relatório [1]. A análise segue.',
    } as AiSummaryResponse));

    component.retry();
    fixture.detectChanges();

    expect(fixture.debugElement.query(By.css('[data-test="evidencia.search.ai-summary.text"]'))
      .nativeElement.textContent.replace(/\s+/g, ' ').trim())
      .toBe('Segundo o relatório.[1] A análise segue.');
  });

  it('mostra um spinner enquanto a síntese não chega', () => {
    setup('educacao', false);
    // A síntese passa por um LLM: sem sinal de progresso a tela parece travada.
    service.summarize.and.returnValue(NEVER);

    fixture.componentRef.setInput('active', true);
    fixture.detectChanges();

    expect(component.firstLoad()).toBeTrue();
    expect(fixture.debugElement.query(By.css('.rdapp-ai__spinner'))).not.toBeNull();
  });

  it('rotula o botão da citação com a página, e sem ela cai no documento', () => {
    setup('educacao', true);

    expect(component.pageLabel(RESPONSE.citations[0]))
      .toBe('evidencia.search.ai-summary.citation.page-link');
    expect(component.pageLabel({ ...RESPONSE.citations[0], page: null }))
      .toBe('evidencia.search.ai-summary.citation.open-item');
  });
});
