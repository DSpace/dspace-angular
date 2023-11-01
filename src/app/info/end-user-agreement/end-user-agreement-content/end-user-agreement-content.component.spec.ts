import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { EndUserAgreementContentComponent } from './end-user-agreement-content.component';
import { TranslateModule } from '@ngx-translate/core';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { RouterLink } from '@angular/router';

describe('EndUserAgreementContentComponent', () => {
  let component: EndUserAgreementContentComponent;
  let fixture: ComponentFixture<EndUserAgreementContentComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), EndUserAgreementContentComponent],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .overrideComponent(EndUserAgreementContentComponent, {
        remove: {
          imports: [RouterLink]
        }
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
