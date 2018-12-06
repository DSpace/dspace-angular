import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NavbarSectionComponent } from './navbar-section.component';

describe('NavbarSectionComponent', () => {
  let component: NavbarSectionComponent;
  let fixture: ComponentFixture<NavbarSectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NavbarSectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NavbarSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
