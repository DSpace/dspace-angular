import { NO_ERRORS_SCHEMA } from '@angular/core';
import {
  ComponentFixture,
  TestBed,
  waitForAsync,
} from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';

import { AuditDataService } from '../../core/audit/audit-data.service';
import { Audit } from '../../core/audit/model/audit.model';
import { PaginationService } from '../../core/pagination/pagination.service';
import { createSuccessfulRemoteDataObject$ } from '../../shared/remote-data.utils';
import { AuditMock } from '../../shared/testing/audit.mock';
import { PaginationServiceStub } from '../../shared/testing/pagination-service.stub';
import { createPaginatedList } from '../../shared/testing/utils.test';
import { AuditTableComponent } from '../audit-table/audit-table.component';
import { AuditOverviewComponent } from './audit-overview.component';

describe('AuditOverviewComponent', () => {
  let component: AuditOverviewComponent;
  let fixture: ComponentFixture<AuditOverviewComponent>;

  let auditService: AuditDataService;
  let audits: Audit[];
  const paginationService = new PaginationServiceStub();

  function init() {
    audits = [ AuditMock ];
    auditService = jasmine.createSpyObj('auditService', {
      findAll: createSuccessfulRemoteDataObject$(createPaginatedList(audits)),
      getEpersonName: of('Eperson Name'),
      auditHasDetails: false,
    });
  }

  beforeEach(waitForAsync(() => {
    init();
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), RouterTestingModule.withRoutes([]), AuditTableComponent, AuditOverviewComponent],
      providers: [
        { provide: AuditDataService, useValue: auditService },
        { provide: PaginationService, useValue: paginationService },
        provideMockStore({}),
      ],
      schemas: [NO_ERRORS_SCHEMA],
    })
      .overrideComponent(AuditOverviewComponent, {
        remove: {
          imports: [AuditTableComponent],
        },
      })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuditOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('audit page overview data settings', () => {
    it('should set audits on init', (done) => {
      component.auditsRD$.subscribe(auditsRD => {
        expect(auditsRD).toBeTruthy();
        expect(auditsRD.payload.page.length).toBe(1);
        const audit = auditsRD.payload.page[0];
        expect(audit.epersonName).toEqual('Eperson Name');
        expect(audit.hasDetails).toBeFalsy();
        done();
      });
    });
  });
});
