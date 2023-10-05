import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { ReviewAccountInfoComponent } from './review-account-info.component';
import {
  TranslateLoader,
  TranslateModule,
  TranslateService,
} from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { TranslateLoaderMock } from '../../shared/mocks/translate-loader.mock';
import { EPersonDataService } from '../../core/eperson/eperson-data.service';
import { Observable, Subscription, of } from 'rxjs';
import { RemoteData } from '../../core/data/remote-data';
import { EPerson } from '../../core/eperson/models/eperson.model';
import { createSuccessfulRemoteDataObject$ } from '../../shared/remote-data.utils';
import { EPersonMock } from '../../shared/testing/eperson.mock';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NotificationsService } from '../../shared/notifications/notifications.service';
import { NotificationsServiceStub } from '../../shared/testing/notifications-service.stub';
import { Router } from '@angular/router';
import { RouterMock } from '../../shared/mocks/router.mock';
import { EventEmitter } from '@angular/core';
import { CompareValuesPipe } from '../helpers/compare-values.pipe';
import { Registration } from '../../core/shared/registration.model';

describe('ReviewAccountInfoComponent', () => {
  let component: ReviewAccountInfoComponent;
  let fixture: ComponentFixture<ReviewAccountInfoComponent>;
  let ePersonDataServiceStub: any;
  let router: any;
  let notificationsService: any;

  const translateServiceStub = {
    get: () => of('test-message'),
    onLangChange: new EventEmitter(),
    onTranslationChange: new EventEmitter(),
    onDefaultLangChange: new EventEmitter()
  };
  const mockEPerson = EPersonMock;
  const modalStub = {
    open: () => ({ componentInstance: { response: of(true) }}),
    close: () => null,
    dismiss: () => null,
  };
  const registrationDataMock = {
    registrationType: 'orcid',
    email: 'test@test.com',
    netId: '0000-0000-0000-0000',
    user: 'a44d8c9e-9b1f-4e7f-9b1a-5c9d8a0b1f1a',
    registrationMetadata: {
      'email': [{ value: 'test@test.com' }],
      'eperson.lastname': [{ value: 'Doe' }],
      'eperson.firstname': [{ value: 'John' }],
    },
  };

  beforeEach(async () => {
    ePersonDataServiceStub = {
      findById(uuid: string): Observable<RemoteData<EPerson>> {
        return createSuccessfulRemoteDataObject$(mockEPerson);
      },
      mergeEPersonDataWithToken(
        token: string,
        metadata?: string
      ): Observable<RemoteData<EPerson>> {
        return createSuccessfulRemoteDataObject$(mockEPerson);
      },
    };
    router = new RouterMock();
    notificationsService = new NotificationsServiceStub();
    await TestBed.configureTestingModule({
      declarations: [ReviewAccountInfoComponent, CompareValuesPipe],
      providers: [
        { provide: EPersonDataService, useValue: ePersonDataServiceStub },
        { provide: NgbModal, useValue: modalStub },
        {
          provide: NotificationsService,
          useValue: notificationsService,
        },
        { provide: TranslateService, useValue: translateServiceStub },
        { provide: Router, useValue: router },
      ],
      imports: [
        CommonModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateLoaderMock,
          },
        }),
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReviewAccountInfoComponent);
    component = fixture.componentInstance;
    component.registrationData = Object.assign(
      new Registration(),
      registrationDataMock
    );
    component.registrationToken = 'test-token';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should prepare data to compare', () => {
    component.ngOnInit();
    const dataToCompare = component.dataToCompare;
    expect(dataToCompare.length).toBe(3);
    expect(dataToCompare[0].label).toBe('email');
    expect(dataToCompare[1].label).toBe('lastname');
    expect(dataToCompare[2].label).toBe('firstname');
    expect(dataToCompare[0].overrideValue).toBe(false);
    expect(dataToCompare[0].receivedValue).toBe('test@test.com');
  });

  it('should update dataToCompare when overrideValue is changed', () => {
    component.onOverrideChange(true, 'email');
    expect(component.dataToCompare[0].overrideValue).toBe(true);
  });

  it('should open a confirmation modal on onSave and confirm', fakeAsync(() => {
    spyOn(modalStub, 'open').and.returnValue({
      componentInstance: { response: of(true) },
    });
    spyOn(component, 'mergeEPersonDataWithToken');
    component.onSave();
    tick();
    expect(modalStub.open).toHaveBeenCalled();
    expect(component.mergeEPersonDataWithToken).toHaveBeenCalled();
  }));

  it('should open a confirmation modal on onSave and cancel', fakeAsync(() => {
    spyOn(modalStub, 'open').and.returnValue({
      componentInstance: { response: of(false) },
    });
    spyOn(component, 'mergeEPersonDataWithToken');
    component.onSave();
    tick();
    expect(modalStub.open).toHaveBeenCalled();
    expect(component.mergeEPersonDataWithToken).not.toHaveBeenCalled();
  }));

  it('should merge EPerson data with token when overrideValue is true', fakeAsync(() => {
    component.dataToCompare[0].overrideValue = true;
    spyOn(ePersonDataServiceStub, 'mergeEPersonDataWithToken').and.returnValue(
      of({ hasSucceeded: true })
    );
    component.mergeEPersonDataWithToken();
    tick();
    expect(ePersonDataServiceStub.mergeEPersonDataWithToken).toHaveBeenCalledTimes(1);
    expect(router.navigate).toHaveBeenCalledWith(['/profile']);
  }));

  it('should display registration data', () => {
    const registrationTypeElement: HTMLElement = fixture.nativeElement.querySelector('tbody tr:first-child th');
    const netIdElement: HTMLElement = fixture.nativeElement.querySelector('tbody tr:first-child td');

    expect(registrationTypeElement.textContent.trim()).toBe(registrationDataMock.registrationType.toUpperCase());
    expect(netIdElement.textContent.trim()).toBe(registrationDataMock.netId);
  });

  it('should display dataToCompare rows with translated labels and values', () => {
    const dataRows: NodeListOf<HTMLElement> = fixture.nativeElement.querySelectorAll('tbody tr:not(:first-child)');
    // Assuming there are 3 dataToCompare rows based on the registrationDataMock
    expect(dataRows.length).toBe(3);
    // Assuming the first row is the email row abd the second row is the lastname row
    const firstDataRow = dataRows[1];
    const firstDataLabel: HTMLElement = firstDataRow.querySelector('th');
    const firstDataReceivedValue: HTMLElement = firstDataRow.querySelectorAll('td')[0];
    const firstDataOverrideSwitch: HTMLElement = firstDataRow.querySelector('ui-switch');
    expect(firstDataLabel.textContent.trim()).toBe('Lastname');
    expect(firstDataReceivedValue.textContent.trim()).toBe('Doe');
    expect(firstDataOverrideSwitch).toBeNull();
  });

  it('should trigger onSave() when the button is clicked', () => {
    spyOn(component, 'onSave');
    const saveButton: HTMLButtonElement = fixture.nativeElement.querySelector('button.btn-primary');
    saveButton.click();
    expect(component.onSave).toHaveBeenCalled();
  });

  it('should unsubscribe from subscriptions when ngOnDestroy is called', () => {
    const subscription1 = jasmine.createSpyObj<Subscription>('Subscription', [
      'unsubscribe',
    ]);
    const subscription2 = jasmine.createSpyObj<Subscription>('Subscription', [
      'unsubscribe',
    ]);
    component.subs = [subscription1, subscription2];
    component.ngOnDestroy();
    expect(subscription1.unsubscribe).toHaveBeenCalled();
    expect(subscription2.unsubscribe).toHaveBeenCalled();
  });

  afterEach(() => {
    fixture.destroy();
  });
});
