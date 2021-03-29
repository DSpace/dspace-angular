import { ProcessOverviewComponent } from './process-overview.component';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { VarDirective } from '../../shared/utils/var.directive';
import { TranslateModule } from '@ngx-translate/core';
import { RouterTestingModule } from '@angular/router/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ProcessDataService } from '../../core/data/processes/process-data.service';
import { Process } from '../processes/process.model';
import { EPersonDataService } from '../../core/eperson/eperson-data.service';
import { EPerson } from '../../core/eperson/models/eperson.model';
import { By } from '@angular/platform-browser';
import { ProcessStatus } from '../processes/process-status.model';
import { createSuccessfulRemoteDataObject$ } from '../../shared/remote-data.utils';
import { createPaginatedList } from '../../shared/testing/utils.test';
import { of as observableOf } from 'rxjs';
import { PaginationService } from '../../core/pagination/pagination.service';
import { PaginationComponentOptions } from '../../shared/pagination/pagination-component-options.model';
import { SortDirection, SortOptions } from '../../core/cache/models/sort-options.model';
import { FindListOptions } from '../../core/data/request.models';
import { PaginationServiceStub } from '../../shared/testing/pagination-service.stub';

describe('ProcessOverviewComponent', () => {
  let component: ProcessOverviewComponent;
  let fixture: ComponentFixture<ProcessOverviewComponent>;

  let processService: ProcessDataService;
  let ePersonService: EPersonDataService;
  let paginationService;

  let processes: Process[];
  let ePerson: EPerson;

  function init() {
    processes = [
      Object.assign(new Process(), {
        processId: 1,
        scriptName: 'script-name',
        startTime: '2020-03-19',
        endTime: '2020-03-19',
        processStatus: ProcessStatus.COMPLETED
      }),
      Object.assign(new Process(), {
        processId: 2,
        scriptName: 'script-name',
        startTime: '2020-03-20',
        endTime: '2020-03-20',
        processStatus: ProcessStatus.FAILED
      }),
      Object.assign(new Process(), {
        processId: 3,
        scriptName: 'another-script-name',
        startTime: '2020-03-21',
        endTime: '2020-03-21',
        processStatus: ProcessStatus.RUNNING
      })
    ];
    ePerson = Object.assign(new EPerson(), {
      metadata: {
        'eperson.firstname': [
          {
            value: 'John',
            language: null
          }
        ],
        'eperson.lastname': [
          {
            value: 'Doe',
            language: null
          }
        ]
      }
    });
    processService = jasmine.createSpyObj('processService', {
      findAll: createSuccessfulRemoteDataObject$(createPaginatedList(processes))
    });
    ePersonService = jasmine.createSpyObj('ePersonService', {
      findById: createSuccessfulRemoteDataObject$(ePerson)
    });

    paginationService = new PaginationServiceStub();
  }

  beforeEach(waitForAsync(() => {
    init();
    TestBed.configureTestingModule({
      declarations: [ProcessOverviewComponent, VarDirective],
      imports: [TranslateModule.forRoot(), RouterTestingModule.withRoutes([])],
      providers: [
        { provide: ProcessDataService, useValue: processService },
        { provide: EPersonDataService, useValue: ePersonService },
        { provide: PaginationService, useValue: paginationService }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProcessOverviewComponent);
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

    it('should display the process IDs in the first column', () => {
      rowElements.forEach((rowElement, index) => {
        const el = rowElement.query(By.css('td:nth-child(1)')).nativeElement;
        expect(el.textContent).toContain(processes[index].processId);
      });
    });

    it('should display the script names in the second column', () => {
      rowElements.forEach((rowElement, index) => {
        const el = rowElement.query(By.css('td:nth-child(2)')).nativeElement;
        expect(el.textContent).toContain(processes[index].scriptName);
      });
    });

    it('should display the eperson\'s name in the third column', () => {
      rowElements.forEach((rowElement, index) => {
        const el = rowElement.query(By.css('td:nth-child(3)')).nativeElement;
        expect(el.textContent).toContain(ePerson.name);
      });
    });

    it('should display the start time in the fourth column', () => {
      rowElements.forEach((rowElement, index) => {
        const el = rowElement.query(By.css('td:nth-child(4)')).nativeElement;
        expect(el.textContent).toContain(processes[index].startTime);
      });
    });

    it('should display the end time in the fifth column', () => {
      rowElements.forEach((rowElement, index) => {
        const el = rowElement.query(By.css('td:nth-child(5)')).nativeElement;
        expect(el.textContent).toContain(processes[index].endTime);
      });
    });

    it('should display the status in the sixth column', () => {
      rowElements.forEach((rowElement, index) => {
        const el = rowElement.query(By.css('td:nth-child(6)')).nativeElement;
        expect(el.textContent).toContain(processes[index].processStatus);
      });
    });
  });
});
