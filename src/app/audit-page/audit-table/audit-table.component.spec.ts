import { NO_ERRORS_SCHEMA } from '@angular/core';
import {
  ComponentFixture,
  TestBed,
  waitForAsync,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { PaginatedList } from 'src/app/core/data/paginated-list.model';

import { Audit } from '../../core/audit/model/audit.model';
import { DSONameService } from '../../core/breadcrumbs/dso-name.service';
import { DSONameServiceMock } from '../../shared/mocks/dso-name.service.mock';
import { PaginationComponent } from '../../shared/pagination/pagination.component';
import { AuditMock } from '../../shared/testing/audit.mock';
import { AuditTableComponent } from './audit-table.component';

describe('AuditTableComponent', () => {
  let component: AuditTableComponent;
  let fixture: ComponentFixture<AuditTableComponent>;

  let audits = new PaginatedList() as PaginatedList<Audit>;

  beforeEach(waitForAsync(() => {
    audits.page = [ AuditMock ];
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot(),
        RouterTestingModule.withRoutes([]),
        AuditTableComponent,
        PaginationComponent,
      ],
      providers: [
        { provide: DSONameService, useValue: new DSONameServiceMock() },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    })
      .overrideComponent(AuditTableComponent, {
        remove: { imports: [PaginationComponent] },
      })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuditTableComponent);
    component = fixture.componentInstance;
    component.audits = audits;
    component.isOverviewPage = true;
    fixture.detectChanges();
  });

  describe('table structure', () => {

    it('should display the entityType in the first column', () => {
      const rowElements = fixture.debugElement.queryAll(By.css('tbody tr'));
      const el = rowElements[0].query(By.css('td:nth-child(1)')).nativeElement;
      expect(el.textContent).toContain(audits.page[0].eventType);
    });

    it('should display the eperson in the second column', () => {
      const rowElements = fixture.debugElement.queryAll(By.css('tbody tr'));
      const el = rowElements[0].query(By.css('td:nth-child(2)')).nativeElement;
      expect(el.textContent).toContain(audits.page[0].epersonName);
    });

    it('should display the timestamp in the third column', () => {
      const rowElements = fixture.debugElement.queryAll(By.css('tbody tr'));
      const el = rowElements[0].query(By.css('td:nth-child(3)')).nativeElement;
      expect(el.textContent).toContain('2020-11-13 10:41:06');
    });

    it('should display the objectUUID in the fourth column', () => {
      const rowElements = fixture.debugElement.queryAll(By.css('tbody tr'));
      const el = rowElements[0].query(By.css('td:nth-child(4)')).nativeElement;
      expect(el.textContent).toContain(audits.page[0].objectUUID);
    });

    it('should display the objectType in the fifth column', () => {
      const rowElements = fixture.debugElement.queryAll(By.css('tbody tr'));
      const el = rowElements[0].query(By.css('td:nth-child(5)')).nativeElement;
      expect(el.textContent).toContain(audits.page[0].objectType);
    });

    it('should display the subjectUUID in the sixth column', () => {
      const rowElements = fixture.debugElement.queryAll(By.css('tbody tr'));
      const el = rowElements[0].query(By.css('td:nth-child(6)')).nativeElement;
      expect(el.textContent).toContain(audits.page[0].subjectUUID);
    });

    it('should display the subjectType in the seventh column', () => {
      const rowElements = fixture.debugElement.queryAll(By.css('tbody tr'));
      const el = rowElements[0].query(By.css('td:nth-child(7)')).nativeElement;
      expect(el.textContent).toContain(audits.page[0].subjectType);
    });
  });
});
