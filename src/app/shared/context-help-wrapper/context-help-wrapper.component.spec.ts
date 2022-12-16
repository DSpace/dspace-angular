import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContextHelpWrapperComponent } from './context-help-wrapper.component';

describe('ContextHelpWrapperComponent', () => {
  let component: ContextHelpWrapperComponent;
  let fixture: ComponentFixture<ContextHelpWrapperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContextHelpWrapperComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContextHelpWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
