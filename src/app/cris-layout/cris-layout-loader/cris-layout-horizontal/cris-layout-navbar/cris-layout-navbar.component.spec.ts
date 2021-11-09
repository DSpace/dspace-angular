import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrisLayoutNavbarComponent } from './cris-layout-navbar.component';

describe('CrisLayoutNavbarComponent', () => {
  let component: CrisLayoutNavbarComponent;
  let fixture: ComponentFixture<CrisLayoutNavbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CrisLayoutNavbarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CrisLayoutNavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
