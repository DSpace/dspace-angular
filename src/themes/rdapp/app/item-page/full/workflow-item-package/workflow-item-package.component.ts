import { AsyncPipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import {
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { DSONameService } from '@dspace/core/breadcrumbs/dso-name.service';
import { BitstreamDataService } from '@dspace/core/data/bitstream-data.service';
import { Bitstream } from '@dspace/core/shared/bitstream.model';
import { followLink } from '@dspace/core/shared/follow-link-config.model';
import { Item } from '@dspace/core/shared/item.model';
import { getFirstCompletedRemoteData } from '@dspace/core/shared/operators';
import { TranslateModule } from '@ngx-translate/core';
import {
  combineLatest,
  Observable,
  of,
} from 'rxjs';
import {
  catchError,
  map,
  startWith,
  switchMap,
} from 'rxjs/operators';

import { ThemedFileDownloadLinkComponent } from '../../../../../../app/shared/file-download-link/themed-file-download-link.component';
import { ThemedLoadingComponent } from '../../../../../../app/shared/loading/themed-loading.component';
import { FileSizePipe } from '../../../../../../app/shared/utils/file-size-pipe';

/**
 * Linha da tabela de arquivos do pacote.
 */
export interface PackageFileRow {
  bitstream: Bitstream;
  name: string;
  format: string;
}

/**
 * Estado da licença do pacote: carregando, com texto, ausente ou com erro.
 */
export interface PackageLicense {
  state: 'loading' | 'ok' | 'empty' | 'error';
  text?: string;
}

/**
 * Seções "Arquivos" (pacote original, com nome, tamanho, formato e botão Baixar) e "Licença do pacote" (license.txt)
 * da tela Visualizar do curador (HU012, CA12).
 */
@Component({
  selector: 'ds-workflow-item-package',
  templateUrl: './workflow-item-package.component.html',
  styleUrls: ['./workflow-item-package.component.scss'],
  imports: [
    AsyncPipe,
    FileSizePipe,
    ThemedFileDownloadLinkComponent,
    ThemedLoadingComponent,
    TranslateModule,
  ],
})
export class WorkflowItemPackageComponent implements OnInit {

  @Input() item: Item;

  files$: Observable<PackageFileRow[] | null>;

  license$: Observable<PackageLicense>;

  constructor(
    protected bitstreamDataService: BitstreamDataService,
    protected dsoNameService: DSONameService,
    protected http: HttpClient,
  ) {
  }

  ngOnInit(): void {
    this.files$ = this.bitstreamDataService.findAllByItemAndBundleName(
      this.item, 'ORIGINAL', { currentPage: 1, elementsPerPage: 100 }, true, true, followLink('format'),
    ).pipe(
      getFirstCompletedRemoteData(),
      switchMap((rd) => rd.hasSucceeded && rd.payload ? this.toRows(rd.payload.page) : of([])),
      startWith(null),
    );

    this.license$ = this.bitstreamDataService.findAllByItemAndBundleName(
      this.item, 'LICENSE', { currentPage: 1, elementsPerPage: 1 }, true, true,
    ).pipe(
      getFirstCompletedRemoteData(),
      switchMap((rd) => {
        const license = rd.hasSucceeded ? rd.payload?.page?.[0] : undefined;
        if (!license) {
          return of<PackageLicense>({ state: 'empty' });
        }
        return this.http.get(license._links.content.href, { responseType: 'text' }).pipe(
          map((text): PackageLicense => ({ state: 'ok', text })),
          catchError(() => of<PackageLicense>({ state: 'error' })),
        );
      }),
      startWith<PackageLicense>({ state: 'loading' }),
    );
  }

  private toRows(page: Bitstream[]): Observable<PackageFileRow[]> {
    if (page.length === 0) {
      return of([]);
    }
    return combineLatest(page.map((bitstream) => bitstream.format.pipe(
      getFirstCompletedRemoteData(),
      map((format) => ({
        bitstream,
        name: this.dsoNameService.getName(bitstream),
        format: format.hasSucceeded && format.payload ? format.payload.shortDescription : '',
      })),
    )));
  }
}
