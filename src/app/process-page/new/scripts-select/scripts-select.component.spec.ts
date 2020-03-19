import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScriptsSelectComponent } from './scripts-select.component';

describe('ScriptsSelectComponent', () => {
  let component: ScriptsSelectComponent;
  let fixture: ComponentFixture<ScriptsSelectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScriptsSelectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScriptsSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
