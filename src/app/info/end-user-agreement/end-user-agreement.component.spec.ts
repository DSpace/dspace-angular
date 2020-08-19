import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { EndUserAgreementComponent } from './end-user-agreement.component';

describe('EndUserAgreementComponent', () => {
  let component: EndUserAgreementComponent;
  let fixture: ComponentFixture<EndUserAgreementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EndUserAgreementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EndUserAgreementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
