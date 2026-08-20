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

import { FailedJob } from '../ingestion.service';
import { IngestionFailuresTableComponent } from './ingestion-failures-table.component';

const ROWS: FailedJob[] = [
  { job_id: 'f1', status: 'erro', stage: 'llm', filename: 'f1.pdf', error: 'timeout no LLM', updated_at: '2026-08-10T08:00:00Z' },
  { job_id: 'f2', status: 'erro', filename: 'f2.pdf' },
];

describe('IngestionFailuresTableComponent', () => {
  let component: IngestionFailuresTableComponent;
  let fixture: ComponentFixture<IngestionFailuresTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        IngestionFailuresTableComponent,
        TranslateModule.forRoot({
          loader: { provide: TranslateLoader, useClass: TranslateLoaderMock },
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(IngestionFailuresTableComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('rows', ROWS);
    fixture.detectChanges();
  });

  it('renderiza uma linha por falha, dentro de um contêiner rolável', () => {
    expect(fixture.debugElement.queryAll(By.css('tbody tr')).length).toBe(2);
    expect(fixture.debugElement.query(By.css('.table-responsive'))).not.toBeNull();
  });

  it('mantém o texto completo do erro acessível', () => {
    const details = fixture.debugElement.query(By.css('details'));

    expect(details).not.toBeNull();
    expect(details.nativeElement.textContent).toContain('timeout no LLM');
  });

  it('lida com falha sem estágio nem mensagem', () => {
    const cells = fixture.debugElement.queryAll(By.css('tbody tr'))[1]
      .queryAll(By.css('td'));

    expect(cells[2].nativeElement.textContent.trim()).toBe('—');
    expect(cells[3].nativeElement.textContent.trim()).toBe('—');
  });

  it('pede confirmação antes de re-enfileirar', () => {
    const emitted: string[] = [];
    component.reprocess.subscribe((id: string) => emitted.push(id));

    fixture.debugElement.queryAll(By.css('tbody tr'))[0]
      .query(By.css('button')).nativeElement.click();
    fixture.detectChanges();

    expect(emitted).toEqual([]);
    expect(component.pendingConfirm()).toBe('f1');

    const confirmButtons = fixture.debugElement.queryAll(By.css('.ingestion-table__confirm button'));
    confirmButtons[0].nativeElement.click();
    fixture.detectChanges();

    expect(emitted).toEqual(['f1']);
    expect(component.pendingConfirm()).toBeNull();
  });

  it('permite cancelar a confirmação', () => {
    const emitted: string[] = [];
    component.reprocess.subscribe((id: string) => emitted.push(id));

    component.askConfirm('f1');
    fixture.detectChanges();
    fixture.debugElement.queryAll(By.css('.ingestion-table__confirm button'))[1]
      .nativeElement.click();
    fixture.detectChanges();

    expect(emitted).toEqual([]);
    expect(component.pendingConfirm()).toBeNull();
  });

  it('mostra o andamento e o erro por linha', () => {
    fixture.componentRef.setInput('states', { f1: { phase: 'loading' } });
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.ingestion-table__pending')).not.toBeNull();

    fixture.componentRef.setInput('states', {
      f1: { phase: 'error', errorKey: 'health-page.ingestion.state.error.forbidden' },
    });
    fixture.detectChanges();

    const rowError = fixture.nativeElement.querySelector('.ingestion-table__row-error');

    expect(rowError).not.toBeNull();
    expect(rowError.getAttribute('role')).toBe('alert');
  });

  it('dá nome acessível ao botão de reprocessar de cada linha', () => {
    const button = fixture.debugElement.queryAll(By.css('tbody tr'))[0].query(By.css('button'));

    expect(button.nativeElement.getAttribute('aria-label')).toContain('f1.pdf');
  });
});
