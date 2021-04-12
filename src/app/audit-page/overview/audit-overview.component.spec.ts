import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { VarDirective } from '../../shared/utils/var.directive';
import { TranslateModule } from '@ngx-translate/core';
import { RouterTestingModule } from '@angular/router/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { of } from 'rxjs';
import { By } from '@angular/platform-browser';
import { createSuccessfulRemoteDataObject$ } from '../../shared/remote-data.utils';
import { createPaginatedList } from '../../shared/testing/utils.test';
import { AuthorizationDataService } from '../../core/data/feature-authorization/authorization-data.service';
import { AuditOverviewComponent } from './audit-overview.component';
import { AuditMock } from '../../shared/testing/audit.mock';
import { Audit } from '../../core/audit/model/audit.model';
import { AuditDataService } from '../../core/audit/audit-data.service';
import { PaginationService } from '../../core/pagination/pagination.service';
import { PaginationServiceStub } from '../../shared/testing/pagination-service.stub';

describe('AuditOverviewComponent', () => {
  let component: AuditOverviewComponent;
  let fixture: ComponentFixture<AuditOverviewComponent>;

  let auditService: AuditDataService;
  let authorizationService: any;
  let audits: Audit[];
  const paginationService = new PaginationServiceStub();

  function init() {
    audits = [ AuditMock, AuditMock, AuditMock ];
    auditService = jasmine.createSpyObj('processService', {
      findAll: createSuccessfulRemoteDataObject$(createPaginatedList(audits)),
      getEpersonName: of('Eperson Name')
    });
    authorizationService = jasmine.createSpyObj('authorizationService', ['isAuthorized']);
  }

  beforeEach(waitForAsync(() => {
    init();
    TestBed.configureTestingModule({
      declarations: [AuditOverviewComponent, VarDirective],
      imports: [TranslateModule.forRoot(), RouterTestingModule.withRoutes([])],
      providers: [
        { provide: AuditDataService, useValue: auditService },
        { provide: AuthorizationDataService, useValue: authorizationService },
        { provide: PaginationService, useValue: paginationService },
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  describe('if the current user is an admin', () => {

    beforeEach(() => {
      authorizationService.isAuthorized.and.callFake(() => of(true));

      fixture = TestBed.createComponent(AuditOverviewComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    describe('table structure', () => {
      let rowElements;

      beforeEach(() => {
        rowElements = fixture.debugElement.queryAll(By.css('tbody tr'));
      });

      it(`should contain 3 rows`, () => {
        expect(rowElements.length).toEqual(3);
      });

      it('should display the audit IDs in the first column', () => {
        rowElements.forEach((rowElement, index) => {
          const el = rowElement.query(By.css('td:nth-child(1)')).nativeElement;
          expect(el.textContent).toContain(audits[index].id);
        });
      });

      it('should display the entityType in the second column', () => {
        rowElements.forEach((rowElement, index) => {
          const el = rowElement.query(By.css('td:nth-child(2)')).nativeElement;
          expect(el.textContent).toContain(audits[index].eventType);
        });
      });

      it('should display the objectUUID in the third column', () => {
        rowElements.forEach((rowElement, index) => {
          const el = rowElement.query(By.css('td:nth-child(3)')).nativeElement;
          expect(el.textContent).toContain(audits[index].objectUUID);
        });
      });

      it('should display the objectType in the fourth column', () => {
        rowElements.forEach((rowElement, index) => {
          const el = rowElement.query(By.css('td:nth-child(4)')).nativeElement;
          expect(el.textContent).toContain(audits[index].objectType);
        });
      });

      it('should display the subjectUUID in the fifth column', () => {
        rowElements.forEach((rowElement, index) => {
          const el = rowElement.query(By.css('td:nth-child(5)')).nativeElement;
          expect(el.textContent).toContain(audits[index].subjectUUID);
        });
      });

      it('should display the subjectType in the sixth column', () => {
        rowElements.forEach((rowElement, index) => {
          const el = rowElement.query(By.css('td:nth-child(6)')).nativeElement;
          expect(el.textContent).toContain(audits[index].subjectType);
        });
      });

      it('should display the eperson name in the seventh column', () => {
        rowElements.forEach((rowElement, index) => {
          const el = rowElement.query(By.css('td:nth-child(7)')).nativeElement;
          expect(el.textContent).toContain('Eperson Name');
        });
      });

    });

  });

  describe('if the current user is not an admin', () => {

    beforeEach(() => {
      authorizationService.isAuthorized.and.callFake(() => of(false));

      fixture = TestBed.createComponent(AuditOverviewComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    describe('table structure', () => {
      let rowElements;

      beforeEach(() => {
        rowElements = fixture.debugElement.queryAll(By.css('tbody tr'));
      });

      it(`should contain 0 rows`, () => {
        expect(rowElements.length).toEqual(0);
      });

    });
  });

});
