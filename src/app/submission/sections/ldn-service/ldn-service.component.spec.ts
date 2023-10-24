import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LdnServiceComponent } from './ldn-service.component';

describe('LdnServiceComponent', () => {
  let component: LdnServiceComponent;
  let fixture: ComponentFixture<LdnServiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LdnServiceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LdnServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
