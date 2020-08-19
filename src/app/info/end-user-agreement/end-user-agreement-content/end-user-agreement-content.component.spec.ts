import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { EndUserAgreementContentComponent } from './end-user-agreement-content.component';

describe('EndUserAgreementContentComponent', () => {
  let component: EndUserAgreementContentComponent;
  let fixture: ComponentFixture<EndUserAgreementContentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EndUserAgreementContentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EndUserAgreementContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
