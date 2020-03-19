import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScriptHelpComponent } from './script-help.component';

describe('ScriptHelpComponent', () => {
  let component: ScriptHelpComponent;
  let fixture: ComponentFixture<ScriptHelpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScriptHelpComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScriptHelpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
