import {
  ChangeDetectorRef,
  EventEmitter,
} from '@angular/core';
import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { By } from '@angular/platform-browser';
import {
  ActivatedRoute,
  Router,
} from '@angular/router';
import {
  NgbDropdownModule,
  NgbModal,
} from '@ng-bootstrap/ng-bootstrap';
import { provideMockStore } from '@ngrx/store/testing';
import {
  TranslateModule,
  TranslateService,
} from '@ngx-translate/core';
import { PaginationService } from 'ngx-pagination';
import { of } from 'rxjs';

import { RouteService } from '../../../core/services/route.service';
import { MockActivatedRoute } from '../../../shared/mocks/active-router.mock';
import { NotificationsService } from '../../../shared/notifications/notifications.service';
import { createSuccessfulRemoteDataObject$ } from '../../../shared/remote-data.utils';
import { NotificationsServiceStub } from '../../../shared/testing/notifications-service.stub';
import { RouterStub } from '../../../shared/testing/router.stub';
import { LdnItemfiltersService } from '../ldn-services-data/ldn-itemfilters-data.service';
import { LdnServicesService } from '../ldn-services-data/ldn-services-data.service';
import { LdnServiceFormComponent } from './ldn-service-form.component';

describe('LdnServiceFormEditComponent', () => {
  let component: LdnServiceFormComponent;
  let fixture: ComponentFixture<LdnServiceFormComponent>;

  let ldnServicesService: LdnServicesService;
  let ldnItemfiltersService: any;
  let cdRefStub: any;
  let modalService: any;
  let activatedRoute: MockActivatedRoute;

  const testId = '1234';
  const routeParams = {
    serviceId: testId,
  };
  const routeUrlSegments = [{ path: 'path' }];
  const formMockValue = {
    'id': '',
    'name': 'name',
    'description': 'description',
    'url': 'www.test.com',
    'ldnUrl': 'https://test.com',
    'lowerIp': '127.0.0.1',
    'upperIp': '100.100.100.100',
    'score': 1,
    'inboundPattern': '',
    'constraintPattern': '',
    'enabled': '',
    'type': 'ldnservice',
    'notifyServiceInboundPatterns': [
      {
        'pattern': '',
        'patternLabel': 'Select a pattern',
        'constraint': '',
        'automatic': false,
      },
    ],
  };


  const translateServiceStub = {
    get: () => of('translated-text'),
    instant: () => 'translated-text',
    onLangChange: new EventEmitter(),
    onTranslationChange: new EventEmitter(),
    onDefaultLangChange: new EventEmitter(),
  };

  beforeEach(async () => {
    ldnServicesService = jasmine.createSpyObj('ldnServicesService', {
      create: of(null),
      update: of(null),
      findById: createSuccessfulRemoteDataObject$({}),
    });

    ldnItemfiltersService = {
      findAll: () => of(['item1', 'item2']),
    };
    cdRefStub = Object.assign({
      detectChanges: () => fixture.detectChanges(),
    });
    modalService = {
      open: () => {/*comment*/
      },
    };


    activatedRoute = new MockActivatedRoute(routeParams, routeUrlSegments);

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, TranslateModule.forRoot(), NgbDropdownModule, LdnServiceFormComponent],
      providers: [
        { provide: LdnServicesService, useValue: ldnServicesService },
        { provide: LdnItemfiltersService, useValue: ldnItemfiltersService },
        { provide: Router, useValue: new RouterStub() },
        { provide: ActivatedRoute, useValue: activatedRoute },
        { provide: ChangeDetectorRef, useValue: cdRefStub },
        { provide: NgbModal, useValue: modalService },
        { provide: NotificationsService, useValue: new NotificationsServiceStub() },
        { provide: TranslateService, useValue: translateServiceStub },
        { provide: PaginationService, useValue: {} },
        FormBuilder,
        RouteService,
        provideMockStore({}),
      ],
    })
      .compileComponents();

    fixture = TestBed.createComponent(LdnServiceFormComponent);
    component = fixture.componentInstance;
    spyOn(component, 'filterPatternObjectsAndAssignLabel').and.callFake((a) => a);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(component.formModel instanceof FormGroup).toBeTruthy();
  });

  it('should init properties correctly', fakeAsync(() => {
    spyOn(component, 'fetchServiceData');
    spyOn(component, 'setItemFilters');
    component.ngOnInit();
    tick(100);
    expect((component as any).serviceId).toEqual(testId);
    expect(component.isNewService).toBeFalsy();
    expect(component.areControlsInitialized).toBeTruthy();
    expect(component.formModel.controls.notifyServiceInboundPatterns).toBeDefined();
    expect(component.fetchServiceData).toHaveBeenCalledWith(testId);
    expect(component.setItemFilters).toHaveBeenCalled();
  }));

  it('should unsubscribe on destroy', () => {
    spyOn((component as any).routeSubscription, 'unsubscribe');
    component.ngOnDestroy();
    expect((component as any).routeSubscription.unsubscribe).toHaveBeenCalled();
  });

  it('should handle create service with valid form', () => {
    spyOn(component, 'fetchServiceData').and.callFake((a) => a);
    component.formModel.addControl('notifyServiceInboundPatterns', (component as any).formBuilder.array([{ pattern: 'patternValue' }]));
    const nameInput = fixture.debugElement.query(By.css('#name'));
    const descriptionInput = fixture.debugElement.query(By.css('#description'));
    const urlInput = fixture.debugElement.query(By.css('#url'));
    const scoreInput = fixture.debugElement.query(By.css('#score'));
    const lowerIpInput = fixture.debugElement.query(By.css('#lowerIp'));
    const upperIpInput = fixture.debugElement.query(By.css('#upperIp'));
    const ldnUrlInput = fixture.debugElement.query(By.css('#ldnUrl'));
    component.formModel.patchValue(formMockValue);

    nameInput.nativeElement.value = 'testName';
    descriptionInput.nativeElement.value = 'testDescription';
    urlInput.nativeElement.value = 'tetsUrl.com';
    ldnUrlInput.nativeElement.value = 'tetsLdnUrl.com';
    scoreInput.nativeElement.value = 1;
    lowerIpInput.nativeElement.value = '127.0.0.1';
    upperIpInput.nativeElement.value = '127.0.0.1';

    fixture.detectChanges();

    expect(component.formModel.valid).toBeTruthy();
  });

  it('should handle create service with invalid form', () => {
    const nameInput = fixture.debugElement.query(By.css('#name'));

    nameInput.nativeElement.value = 'testName';
    fixture.detectChanges();

    expect(component.formModel.valid).toBeFalsy();
  });

  it('should not create service with invalid form', () => {
    spyOn(component.formModel, 'markAllAsTouched');
    spyOn(component, 'closeModal');
    component.createService();

    expect(component.formModel.markAllAsTouched).toHaveBeenCalled();
    expect(component.closeModal).toHaveBeenCalled();
  });

  it('should create service with valid form', () => {
    spyOn(component.formModel, 'markAllAsTouched');
    spyOn(component, 'closeModal');
    spyOn(component, 'checkPatterns').and.callFake(() => true);
    component.formModel.addControl('notifyServiceInboundPatterns', (component as any).formBuilder.array([{ pattern: 'patternValue' }]));
    component.formModel.patchValue(formMockValue);
    component.createService();

    expect(component.formModel.markAllAsTouched).toHaveBeenCalled();
    expect(component.closeModal).not.toHaveBeenCalled();
    expect(ldnServicesService.create).toHaveBeenCalled();
  });

  it('should check patterns', () => {
    const arrValid = new FormArray([
      new FormGroup({
        pattern: new FormControl('pattern'),
      }),
    ]);

    const arrInvalid = new FormArray([
      new FormGroup({
        pattern: new FormControl(''),
      }),
    ]);

    expect(component.checkPatterns(arrValid)).toBeTruthy();
    expect(component.checkPatterns(arrInvalid)).toBeFalsy();
  });

  it('should fetch service data', () => {
    component.fetchServiceData(testId);
    expect(ldnServicesService.findById).toHaveBeenCalledWith(testId);
    expect(component.filterPatternObjectsAndAssignLabel).toHaveBeenCalled();
    expect((component as any).ldnService).toEqual({});
  });

  it('should generate patch operations', () => {
    spyOn(component as any, 'createReplaceOperation');
    spyOn(component as any, 'handlePatterns');
    component.generatePatchOperations();
    expect((component as any).createReplaceOperation).toHaveBeenCalledTimes(7);
    expect((component as any).handlePatterns).toHaveBeenCalled();
  });

  it('should open modal on submit', () => {
    spyOn(component, 'openConfirmModal');
    component.onSubmit();
    expect(component.openConfirmModal).toHaveBeenCalled();
  });


  it('should reset form and leave', () => {
    spyOn(component as any, 'sendBack');

    component.resetFormAndLeave();
    expect((component as any).sendBack).toHaveBeenCalled();
  });
});
