import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DefineLicenseFormComponent } from './define-license-form.component';
import { SharedModule } from '../../../../shared/shared.module';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { RouterTestingModule } from '@angular/router/testing';
import { ClarinLicenseLabelDataService } from '../../../../core/data/clarin/clarin-license-label-data.service';
import { PaginationService } from '../../../../core/pagination/pagination.service';
import { PaginationServiceStub } from '../../../../shared/testing/pagination-service.stub';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { HostWindowService } from '../../../../shared/host-window.service';
import { HostWindowServiceStub } from '../../../../shared/testing/host-window-service.stub';
import { DomSanitizer } from '@angular/platform-browser';
import { createSuccessfulRemoteDataObject$ } from '../../../../shared/remote-data.utils';
import { buildPaginatedList } from '../../../../core/data/paginated-list.model';
import { PageInfo } from '../../../../core/shared/page-info.model';
import { ClarinLicenseLabel } from '../../../../core/shared/clarin/clarin-license-label.model';

describe('DefineLicenseFormComponent', () => {
  let component: DefineLicenseFormComponent;
  let fixture: ComponentFixture<DefineLicenseFormComponent>;

  let clarinLicenseLabelDataService: ClarinLicenseLabelDataService;
  let modalStub: NgbActiveModal;
  let sanitizerStub: DomSanitizer;

  beforeEach(async () => {
    clarinLicenseLabelDataService = jasmine.createSpyObj('clarinLicenseLabelService', {
      findAll: createSuccessfulRemoteDataObject$(buildPaginatedList(new PageInfo(), [
        Object.assign(new ClarinLicenseLabel(), {
          id: 1,
          label: 'exLL',
          title: 'exTTL',
          extended: true,
          icon: [new Blob(['blob string'], {
            type: 'text/plain'
          })],
          _links: {
            self: {
              href: 'url.ex.1'
            }
          }
        }),
        Object.assign(new ClarinLicenseLabel(), {
          id: 2,
          label: 'LLL',
          title: 'licenseLTTL',
          extended: false,
          icon: null,
          _links: {
            self: {
              href: 'url.ex.1'
            }
          }
        })
      ]))
    });
    modalStub = jasmine.createSpyObj('modalService', ['close', 'open']);
    sanitizerStub = jasmine.createSpyObj('sanitizer', {
      bypassSecurityTrustUrl: null
    });

    await TestBed.configureTestingModule({
      imports: [
        SharedModule,
        CommonModule,
        ReactiveFormsModule,
        TranslateModule.forRoot(),
        RouterTestingModule.withRoutes([])
      ],
      declarations: [ DefineLicenseFormComponent ],
      providers: [
        { provide: ClarinLicenseLabelDataService, useValue: clarinLicenseLabelDataService },
        { provide: PaginationService, useValue: new PaginationServiceStub() },
        { provide: NgbActiveModal, useValue: modalStub },
        { provide: DomSanitizer, useValue: sanitizerStub },
        { provide: HostWindowService, useValue: new HostWindowServiceStub(0) },
      ],
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DefineLicenseFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    component = null;
    clarinLicenseLabelDataService = null;
    fixture.destroy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create clarinLicenseForm on init', () => {
    expect((component as any).clarinLicenseForm).not.toBeNull();
  });

  it('should load and assign extended and non extended clarin license labels options ' +
    'to the specific arrays on init',() => {
    expect((component as any).clarinLicenseLabelOptions).not.toBeNull();
    expect((component as any).extendedClarinLicenseLabelOptions).not.toBeNull();
    expect((component as any).clarinLicenseLabelOptions?.length).toBe(1);
    expect((component as any).extendedClarinLicenseLabelOptions?.length).toBe(1);
  });

  it('after clicking on submit button the active modal should call close function ' +
    'with clarinLicenseForm values', () => {
    (component as DefineLicenseFormComponent).submitForm();
    expect((component as any).activeModal.close).toHaveBeenCalledWith(
      (component as DefineLicenseFormComponent).clarinLicenseForm.value);
  });
});
