import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExternalLoginPageComponent } from './external-login-page.component';

describe('ExternalLoginPageComponent', () => {
  let component: ExternalLoginPageComponent;
  let fixture: ComponentFixture<ExternalLoginPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExternalLoginPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExternalLoginPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
