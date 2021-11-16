import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrisLayoutSidebarComponent } from './cris-layout-sidebar.component';

describe('CrisLayoutSidebarComponent', () => {
  let component: CrisLayoutSidebarComponent;
  let fixture: ComponentFixture<CrisLayoutSidebarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CrisLayoutSidebarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CrisLayoutSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
