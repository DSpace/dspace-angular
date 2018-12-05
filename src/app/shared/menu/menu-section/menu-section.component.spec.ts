import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuSectionComponent } from './menu-section.component';

describe('MenuSectionComponent', () => {
  let component: MenuSectionComponent;
  let fixture: ComponentFixture<MenuSectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MenuSectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
