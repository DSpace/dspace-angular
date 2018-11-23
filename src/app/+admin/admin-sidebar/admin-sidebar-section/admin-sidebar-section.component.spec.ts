import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminSidebarSectionComponent } from './admin-sidebar-section.component';

describe('AdminSidebarSectionComponent', () => {
  let component: AdminSidebarSectionComponent;
  let fixture: ComponentFixture<AdminSidebarSectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminSidebarSectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminSidebarSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
