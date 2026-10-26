import { AsyncPipe } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { EPersonDataService } from '@dspace/core/eperson/eperson-data.service';
import { EPerson } from '@dspace/core/eperson/models/eperson.model';
import { PaginationService } from '@dspace/core/pagination/pagination.service';
import { getFirstCompletedRemoteData } from '@dspace/core/shared/operators';
import { TranslateModule } from '@ngx-translate/core';
import {
  forkJoin,
  Observable,
  of,
  switchMap,
} from 'rxjs';
import {
  filter,
  map,
  mergeMap,
} from 'rxjs/operators';
import { validate as uuidValidate } from 'uuid';

import { AuditOverviewComponent as BaseAuditOverviewComponent } from '../../../../../app/audit-page/overview/audit-overview.component';
import { Audit } from '../../../../../app/core/audit/model/audit.model';
import { PaginatedList } from '../../../../../app/core/data/paginated-list.model';
import { RemoteData } from '../../../../../app/core/data/remote-data';
import { followLink } from '../../../../../app/core/shared/follow-link-config.model';
import {
  AuditFilters,
  RdappAuditDataService,
} from '../../core/data/rdapp-audit-data.service';
import { AuditTableComponent } from '../audit-table/audit-table.component';

export const AUDIT_SUBJECT_TYPE_ALL = 'all';

interface SubjectTypeOption {
  value: string;
  labelKey: string;
}

/**
 * Campos do formulário de filtros. O usuário é informado pelo e-mail e convertido em UUID antes da busca.
 */
interface AuditFilterForm {
  email: string;
  object: string;
  dateFrom: string;
  dateTo: string;
}

/**
 * RDAPP override of the native audit overview page: filtro por tipo de sujeito (Usuário/Grupo), como a HU009 CA09
 * pede, e filtros por usuário, objeto e período sobre o endpoint findByFilters do backend (HU009 D9, CA09.3).
 */
@Component({
  selector: 'ds-themed-audit-overview',
  templateUrl: './audit-overview.component.html',
  styleUrls: ['./audit-overview.component.scss'],
  imports: [
    AsyncPipe,
    AuditTableComponent,
    FormsModule,
    TranslateModule,
  ],
})
export class AuditOverviewComponent extends BaseAuditOverviewComponent {

  // O campo subject_type no Solr é indexado como string exata, sem normalização de caixa
  // (confirmado via /solr/audit/schema/fields/subject_type: type "string", sem analyzer),
  // e o DSpace grava o nome da constante em maiúsculas (EPERSON, GROUP) — os valores aqui
  // precisam bater exatamente com isso, não com a grafia "bonita" (EPerson, Group).
  readonly subjectTypeOptions: SubjectTypeOption[] = [
    { value: AUDIT_SUBJECT_TYPE_ALL, labelKey: 'rdapp.audit-overview.filter.all' },
    { value: 'EPERSON', labelKey: 'rdapp.audit-overview.filter.eperson' },
    { value: 'GROUP', labelKey: 'rdapp.audit-overview.filter.group' },
  ];

  selectedType = AUDIT_SUBJECT_TYPE_ALL;

  form: AuditFilterForm = this.emptyForm();

  /**
   * Filtros em uso na busca atual, já com o UUID do usuário resolvido.
   */
  activeFilters: AuditFilters = {};

  /**
   * Chave i18n do erro de validação do formulário, ou null quando não há erro.
   */
  filterError: string = null;

  constructor(
    protected auditService: RdappAuditDataService,
    protected paginationService: PaginationService,
    protected epersonService: EPersonDataService,
    protected cdr: ChangeDetectorRef,
  ) {
    super(auditService, paginationService);
  }

  onFilterChange(): void {
    this.applyFilters();
  }

  /**
   * Valida o formulário, resolve o e-mail em UUID e refaz a busca a partir da primeira página.
   */
  applyFilters(): void {
    this.filterError = this.validateForm();
    if (this.filterError) {
      return;
    }
    this.resolveEperson(this.form.email.trim()).subscribe((epersonId) => {
      if (epersonId === null) {
        this.filterError = 'rdapp.audit-overview.filter.error.eperson-not-found';
        // A resposta da busca por e-mail chega fora da zona do Angular; sem isto o erro não aparece na tela.
        this.cdr.detectChanges();
        return;
      }
      this.activeFilters = {
        types: this.selectedType === AUDIT_SUBJECT_TYPE_ALL ? undefined : [this.selectedType],
        eperson: epersonId,
        object: this.form.object.trim() || undefined,
        dateFrom: this.form.dateFrom || undefined,
        dateTo: this.form.dateTo || undefined,
      };
      this.paginationService.resetPage(this.pageId);
      this.setAudits();
    });
  }

  clearFilters(): void {
    this.selectedType = AUDIT_SUBJECT_TYPE_ALL;
    this.form = this.emptyForm();
    this.applyFilters();
  }

  override setAudits(): void {
    this.auditsRD$ = this.paginationService.getFindListOptions(this.pageId, this.config).pipe(
      switchMap((config) => {
        return this.hasActiveFilters()
          ? this.auditService.findByFilters(this.activeFilters, config, false)
          : this.auditService.findAll(config, false, true, followLink('eperson'));
      }),
      filter(data => !!data),
      map((audits) => {
        audits.payload?.page.forEach((audit) => {
          audit.hasDetails = this.auditService.auditHasDetails(audit);
        });
        return audits;
      }),
      mergeMap((auditsRD) => {
        const page = auditsRD.payload?.page ?? [];
        if (page.length === 0) {
          return of(auditsRD);
        }
        const updatedAudits$ = page.map((audit) => {
          return this.auditService.getEpersonName(audit).pipe(
            map((name) => Object.assign(new Audit(), audit, { epersonName: name })),
          );
        });
        return forkJoin(updatedAudits$).pipe(
          map((updatedAudits) => Object.assign(new RemoteData(
            auditsRD.timeCompleted,
            auditsRD.msToLive,
            auditsRD.lastUpdated,
            auditsRD.state,
            auditsRD.errorMessage,
            Object.assign(new PaginatedList(), { ...auditsRD.payload, page: updatedAudits }),
            auditsRD.statusCode,
          ))),
        );
      }),
    );
  }

  private hasActiveFilters(): boolean {
    return Object.values(this.activeFilters).some((value) => value !== undefined);
  }

  private validateForm(): string {
    const object = this.form.object.trim();
    if (object && !uuidValidate(object)) {
      return 'rdapp.audit-overview.filter.error.object-invalid';
    }
    if (this.form.dateFrom && this.form.dateTo && this.form.dateFrom > this.form.dateTo) {
      return 'rdapp.audit-overview.filter.error.date-range';
    }
    return null;
  }

  /**
   * UUID do usuário com o e-mail informado. Sem e-mail, emite undefined (sem filtro); e-mail sem cadastro, null.
   */
  private resolveEperson(email: string): Observable<string> {
    if (!email) {
      return of(undefined);
    }
    return this.epersonService.getEPersonByEmail(email).pipe(
      getFirstCompletedRemoteData(),
      map((rd) => rd.hasSucceeded ? (rd.payload as EPerson)?.id ?? null : null),
    );
  }

  private emptyForm(): AuditFilterForm {
    return { email: '', object: '', dateFrom: '', dateTo: '' };
  }
}
