import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  waitForAsync,
} from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';

import { TruncatableComponent } from '../../../../shared/truncatable/truncatable.component';
import { TruncatablePartComponent } from '../../../../shared/truncatable/truncatable-part/truncatable-part.component';
import { RequestStatusEnum } from '../notify-status.enum';
import { RequestStatusAlertBoxComponent } from './request-status-alert-box.component';

describe('RequestStatusAlertBoxComponent', () => {
  let component: RequestStatusAlertBoxComponent;
  let componentAsAny: any;
  let fixture: ComponentFixture<RequestStatusAlertBoxComponent>;

  const mockData = [
    {
      serviceName: 'test',
      serviceUrl: 'test',
      status: RequestStatusEnum.ACCEPTED,
      offerType: 'test',
    },
    {
      serviceName: 'test1',
      serviceUrl: 'test',
      status: RequestStatusEnum.REJECTED,
      offerType: 'test',
    },
  ];

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), RequestStatusAlertBoxComponent],
    }).overrideComponent(RequestStatusAlertBoxComponent, {
      remove: {
        imports: [TruncatablePartComponent, TruncatableComponent],
      },
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestStatusAlertBoxComponent);
    component = fixture.componentInstance;
    component.data = mockData;
    component.displayOptions = {
      alertType: 'alert-danger',
      text: 'request-status-alert-box.rejected',
    };
    componentAsAny = component;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should display the alert box when data is available', fakeAsync(() => {
    const alertBoxElement = fixture.nativeElement.querySelector('.alert');
    expect(alertBoxElement).toBeTruthy();
  }));
});
