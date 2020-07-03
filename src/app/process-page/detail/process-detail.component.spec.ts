import { ProcessDetailComponent } from './process-detail.component';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { VarDirective } from '../../shared/utils/var.directive';
import { TranslateModule } from '@ngx-translate/core';
import { RouterTestingModule } from '@angular/router/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ProcessDetailFieldComponent } from './process-detail-field/process-detail-field.component';
import { Process } from '../processes/process.model';
import { ActivatedRoute } from '@angular/router';
import { of as observableOf } from 'rxjs';
import { By } from '@angular/platform-browser';
import { FileSizePipe } from '../../shared/utils/file-size-pipe';
import { Bitstream } from '../../core/shared/bitstream.model';
import { ProcessDataService } from '../../core/data/processes/process-data.service';
import { DSONameService } from '../../core/breadcrumbs/dso-name.service';
import { createSuccessfulRemoteDataObject, createSuccessfulRemoteDataObject$ } from '../../shared/remote-data.utils';
import { createPaginatedList } from '../../shared/testing/utils.test';

describe('ProcessDetailComponent', () => {
  let component: ProcessDetailComponent;
  let fixture: ComponentFixture<ProcessDetailComponent>;

  let processService: ProcessDataService;
  let nameService: DSONameService;

  let process: Process;
  let fileName: string;
  let files: Bitstream[];

  function init() {
    process = Object.assign(new Process(), {
      processId: 1,
      scriptName: 'script-name',
      parameters: [
        {
          name: '-f',
          value: 'file.xml'
        },
        {
          name: '-i',
          value: 'identifier'
        }
      ]
    });
    fileName = 'fake-file-name';
    files = [
      Object.assign(new Bitstream(), {
        sizeBytes: 10000,
        metadata: {
          'dc.title': [
            {
              value: fileName,
              language: null
            }
          ]
        },
        _links: {
          content: { href: 'file-selflink' }
        }
      })
    ];
    processService = jasmine.createSpyObj('processService', {
      getFiles: createSuccessfulRemoteDataObject$(createPaginatedList(files))
    });
    nameService = jasmine.createSpyObj('nameService', {
      getName: fileName
    });
  }

  beforeEach(async(() => {
    init();
    TestBed.configureTestingModule({
      declarations: [ProcessDetailComponent, ProcessDetailFieldComponent, VarDirective, FileSizePipe],
      imports: [TranslateModule.forRoot(), RouterTestingModule.withRoutes([])],
      providers: [
        { provide: ActivatedRoute, useValue: { data: observableOf({ process: createSuccessfulRemoteDataObject(process) }) } },
        { provide: ProcessDataService, useValue: processService },
        { provide: DSONameService, useValue: nameService }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProcessDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should display the script\'s name', () => {
    const name = fixture.debugElement.query(By.css('#process-name')).nativeElement;
    expect(name.textContent).toContain(process.scriptName);
  });

  it('should display the process\'s parameters', () => {
    const args = fixture.debugElement.query(By.css('#process-arguments')).nativeElement;
    process.parameters.forEach((param) => {
      expect(args.textContent).toContain(`${param.name} ${param.value}`)
    });
  });

  it('should display the process\'s output files', () => {
    const processFiles = fixture.debugElement.query(By.css('#process-files')).nativeElement;
    expect(processFiles.textContent).toContain(fileName);
  });

});
