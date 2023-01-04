import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContextHelpToggleComponent } from './context-help-toggle.component';

describe('ContextHelpToggleComponent', () => {
  let component: ContextHelpToggleComponent;
  let fixture: ComponentFixture<ContextHelpToggleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContextHelpToggleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContextHelpToggleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
