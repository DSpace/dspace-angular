import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpandableNavbarSectionComponent } from './expandable-navbar-section.component';

describe('ExpandableNavbarSectionComponent', () => {
  let component: ExpandableNavbarSectionComponent;
  let fixture: ComponentFixture<ExpandableNavbarSectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExpandableNavbarSectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpandableNavbarSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
