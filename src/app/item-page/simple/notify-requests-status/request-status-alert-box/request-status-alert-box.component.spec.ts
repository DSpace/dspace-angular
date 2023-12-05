import { ComponentFixture, TestBed, fakeAsync } from '@angular/core/testing';
import { RequestStatusAlertBoxComponent } from './request-status-alert-box.component';
import { TranslateModule } from '@ngx-translate/core';
import { RequestStatusEnum } from '../notify-status.enum';

describe('RequestStatusAlertBoxComponent', () => {
  let component: RequestStatusAlertBoxComponent;
  let componentAsAny: any;
  let fixture: ComponentFixture<RequestStatusAlertBoxComponent>;

  const mockData = [
    {
      serviceName: 'test',
      serviceUrl: 'test',
      status: RequestStatusEnum.ACCEPTED,
      offerType: 'test'
    },
    {
      serviceName: 'test1',
      serviceUrl: 'test',
      status: RequestStatusEnum.REJECTED,
      offerType: 'test'
    },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      declarations: [RequestStatusAlertBoxComponent],
    }).compileComponents();
  });

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
