/* eslint-disable max-classes-per-file */
import { HttpClient } from '@angular/common/http';
import {
  Component,
  Input,
} from '@angular/core';
import {
  ComponentFixture,
  TestBed,
} from '@angular/core/testing';
import { DSONameService } from '@dspace/core/breadcrumbs/dso-name.service';
import { BitstreamDataService } from '@dspace/core/data/bitstream-data.service';
import { LocaleService } from '@dspace/core/locale/locale.service';
import { Bitstream } from '@dspace/core/shared/bitstream.model';
import { BitstreamFormat } from '@dspace/core/shared/bitstream-format.model';
import { Item } from '@dspace/core/shared/item.model';
import { TranslateModule } from '@ngx-translate/core';
import {
  of,
  throwError,
} from 'rxjs';

import { createPaginatedList } from '../../../../../../app/core/testing/utils.test';
import {
  createFailedRemoteDataObject$,
  createSuccessfulRemoteDataObject$,
} from '../../../../../../app/core/utilities/remote-data.utils';
import { ThemedFileDownloadLinkComponent } from '../../../../../../app/shared/file-download-link/themed-file-download-link.component';
import { ThemedLoadingComponent } from '../../../../../../app/shared/loading/themed-loading.component';
import { WorkflowItemPackageComponent } from './workflow-item-package.component';

@Component({ selector: 'ds-file-download-link', template: '<ng-content></ng-content>' })
class FileDownloadLinkStubComponent {
  @Input() bitstream: unknown;
  @Input() item: unknown;
  @Input() showIcon: unknown;
  @Input() showAccessStatusBadge: unknown;
  @Input() enableRequestACopy: unknown;
}

@Component({ selector: 'ds-loading', template: '' })
class LoadingStubComponent {
  @Input() showMessage: unknown;
}

describe('WorkflowItemPackageComponent', () => {
  let fixture: ComponentFixture<WorkflowItemPackageComponent>;
  let bitstreamService: { findAllByItemAndBundleName: jasmine.Spy };
  let http: { get: jasmine.Spy };

  const item = Object.assign(new Item(), { uuid: 'item-1' });

  function bitstream(id: string, name: string, sizeBytes: number, format: string, content = `http://rest/${id}/content`) {
    return Object.assign(new Bitstream(), {
      id,
      uuid: id,
      name,
      sizeBytes,
      format: createSuccessfulRemoteDataObject$(Object.assign(new BitstreamFormat(), { shortDescription: format })),
      _links: { content: { href: content } },
    });
  }

  function text() {
    return fixture.nativeElement.textContent.replace(/\s+/g, ' ');
  }

  async function create(original: Bitstream[] | 'falha', license: Bitstream[] | 'falha', licenseContent: unknown = of('Texto da licença')) {
    bitstreamService = {
      findAllByItemAndBundleName: jasmine.createSpy('findAllByItemAndBundleName').and.callFake((_item: Item, bundle: string) => {
        const source = bundle === 'ORIGINAL' ? original : license;
        return source === 'falha'
          ? createFailedRemoteDataObject$('erro', 500)
          : createSuccessfulRemoteDataObject$(createPaginatedList(source));
      }),
    };
    http = { get: jasmine.createSpy('get').and.returnValue(licenseContent) };
    await TestBed.configureTestingModule({
      imports: [WorkflowItemPackageComponent, TranslateModule.forRoot()],
      providers: [
        { provide: BitstreamDataService, useValue: bitstreamService },
        { provide: DSONameService, useValue: { getName: (dso: Bitstream) => dso.name } },
        { provide: HttpClient, useValue: http },
        { provide: LocaleService, useValue: { getCurrentLanguageCode: () => of('pt-BR') } },
      ],
    }).overrideComponent(WorkflowItemPackageComponent, {
      remove: { imports: [ThemedFileDownloadLinkComponent, ThemedLoadingComponent] },
      add: { imports: [FileDownloadLinkStubComponent, LoadingStubComponent] },
    }).compileComponents();
    fixture = TestBed.createComponent(WorkflowItemPackageComponent);
    fixture.componentInstance.item = item;
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  }

  it('lista os arquivos do pacote original com nome, tamanho, formato e Baixar', async () => {
    await create([bitstream('a', 'relatorio.pdf', 2048, 'Adobe PDF'), bitstream('b', 'dados.xlsx', 100, 'Excel')], []);
    const rows = fixture.nativeElement.querySelectorAll('table.workflow-files tbody tr');
    expect(rows.length).toBe(2);
    expect(rows[0].textContent).toContain('relatorio.pdf');
    expect(rows[0].textContent).toContain('Adobe PDF');
    expect(rows[0].textContent).toContain('2 KB');
    expect(rows[1].textContent).toContain('dados.xlsx');
    expect(fixture.nativeElement.querySelectorAll('ds-file-download-link').length).toBe(2);
    expect(text()).toContain('evidencia.workflow-view.files.download');
  });

  it('busca os arquivos no bundle ORIGINAL e a licença no bundle LICENSE', async () => {
    await create([], []);
    const bundles = bitstreamService.findAllByItemAndBundleName.calls.allArgs().map((args) => args[1]);
    expect(bundles).toEqual(['ORIGINAL', 'LICENSE']);
  });

  it('avisa quando não há arquivos', async () => {
    await create([], []);
    expect(fixture.nativeElement.querySelector('table')).toBeNull();
    expect(text()).toContain('evidencia.workflow-view.files.empty');
  });

  it('trata falha ao carregar os arquivos como lista vazia', async () => {
    await create('falha', []);
    expect(text()).toContain('evidencia.workflow-view.files.empty');
  });

  it('mostra o conteúdo da licença do pacote', async () => {
    await create([], [bitstream('l', 'license.txt', 10, 'Texto')]);
    expect(http.get).toHaveBeenCalledWith('http://rest/l/content', { responseType: 'text' });
    expect(fixture.nativeElement.querySelector('pre.workflow-license').textContent).toContain('Texto da licença');
  });

  it('avisa quando o item não tem licença', async () => {
    await create([], []);
    expect(fixture.nativeElement.querySelector('pre')).toBeNull();
    expect(text()).toContain('evidencia.workflow-view.license.empty');
  });

  it('avisa quando a licença não pode ser carregada', async () => {
    await create([], [bitstream('l', 'license.txt', 10, 'Texto')], throwError(() => new Error('403')));
    expect(fixture.nativeElement.querySelector('pre')).toBeNull();
    expect(fixture.nativeElement.querySelector('[role=alert]').textContent).toContain('evidencia.workflow-view.license.error');
  });
});
